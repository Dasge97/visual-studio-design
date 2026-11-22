#!/usr/bin/env python3
"""Checks for the specification bundle; not a substitute for runtime validation."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []


def check(value, message):
    if not value:
        errors.append(message)


def read(path):
    return json.loads((ROOT / path).read_text())


for path in ROOT.rglob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if target.startswith(('http:', 'https:', '#', 'mailto:')):
            continue
        target = target.split('#')[0]
        check((path.parent / target).exists(), f'Broken link: {path.relative_to(ROOT)} -> {target}')

doc = read('examples/twin-hills.design.json')
check(doc['schemaVersion'] == 1, 'Unsupported schemaVersion')
for collection in ['screens', 'nodes', 'components', 'tokens', 'viewports', 'variables', 'scenarios', 'stateRules', 'interactions']:
    for key, item in doc[collection].items():
        check(key == item['id'], f'{collection}: map key differs from id: {key}')

nodes = doc['nodes']
seen = set()


def walk(node_id, chain):
    if node_id not in nodes:
        check(False, f'Missing node {node_id}')
        return
    if node_id in chain:
        check(False, f'Cycle: {node_id}')
        return
    check(node_id not in seen, f'Multiple parents: {node_id}')
    seen.add(node_id)
    node = nodes[node_id]
    check(node['type'] in ['container', 'text', 'shape', 'image', 'instance'], f'Invalid type: {node_id}')
    for axis in ['width', 'height']:
        size = node['layout'][axis]
        check(size['mode'] in ['fixed', 'hug', 'fill'], f'Invalid size: {node_id}')
        if size['mode'] == 'fixed':
            check(size['value'] >= 0, f'Negative size: {node_id}')
    for prop in node['appearance'].values():
        if isinstance(prop, dict) and 'tokenId' in prop:
            check(prop['tokenId'] in doc['tokens'], f'Missing token: {node_id}')
    content = node.get('content', {})
    if content.get('kind') == 'binding':
        check(content['variableId'] in doc['variables'], f'Missing variable binding: {node_id}')
    if node['type'] == 'container':
        for child in node['children']:
            if child in nodes:
                expected = 'anchored' if node['childrenLayout']['mode'] == 'free' else 'flow-child'
                check(nodes[child]['layout']['mode'] == expected, f'Layout mismatch: {child}')
            walk(child, chain | {node_id})


for screen in doc['screens'].values():
    check(screen['referenceViewportId'] in screen['viewportIds'], 'Reference viewport absent')
    for viewport in screen['viewportIds']:
        check(viewport in doc['viewports'], f'Missing viewport {viewport}')
    walk(screen['rootId'], set())
check(seen == set(nodes), 'Orphan nodes exist')

for scenario in doc['scenarios'].values():
    check(scenario['screenId'] in doc['screens'], 'Missing scenario screen')
    for key, value in scenario['values'].items():
        check(key in doc['variables'], f'Missing scenario variable: {key}')
        if key in doc['variables']:
            type_ = doc['variables'][key]['type']
            valid = {'number': type(value) in (int, float), 'boolean': type(value) is bool, 'string': type(value) is str}[type_]
            check(valid, f'Scenario type mismatch: {key}')
    for key in scenario['visibility']:
        check(key in nodes, f'Missing scenario node: {key}')


def operand(op, values):
    return values[op['variableId']] if op['kind'] == 'variable' else op['value']


def condition(expr, values):
    left, right = operand(expr['left'], values), operand(expr['right'], values)
    return {'lt': lambda: left < right, 'gte': lambda: left >= right}[expr['op']]()


for interaction in doc['interactions'].values():
    check(interaction['nodeId'] in nodes, 'Missing interaction node')
    for action in interaction['actions']:
        if 'nodeId' in action:
            check(action['nodeId'] in nodes, 'Missing action node')
        if 'variableId' in action:
            check(action['variableId'] in doc['variables'], 'Missing action variable')
        if 'screenId' in action:
            check(action['screenId'] in doc['screens'], 'Missing action screen')

no_resources = doc['scenarios']['no-resources']['values']
available = doc['scenarios']['upgrade-available']['values']
check(no_resources['money'] == 0, 'No-resources scenario must use zero money')
check(condition(doc['stateRules']['cannot-buy']['when'], no_resources), 'Buy should be disabled without resources')
check(not condition(doc['interactions']['buy']['when'], no_resources), 'Buy condition allows insufficient resources')
check(condition(doc['interactions']['buy']['when'], available), 'Buy should be possible in available scenario')

command = read('examples/command.json')
check(command['expectedRevision'] == 1, 'Unexpected example base revision')
for operation in command['operations']:
    check(operation['nodeId'] in nodes, 'Command targets missing node')
decision = read('examples/decision.json')
check(decision['projectId'] == command['projectId'], 'Examples disagree on project')
for node_id in decision['scope']['nodeIds']:
    check(node_id in nodes, 'Decision references missing node')
check(decision['approvedSnapshotId'] is None and decision['status'] == 'pending', 'Example approval must not be fabricated')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: Markdown links; {len(nodes)} nodes; {len(doc["scenarios"])} scenarios; command and decision references; simulation examples.')
