/** Contrato v1 para implementar. Los validadores runtime y operaciones se crean en H0/H1. */
export type Id = string;
export type Value = string | number | boolean;
export type Fidelity = 'sketch' | 'appearance' | 'prototype';
export type Anchor = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type Size = { mode: 'fixed'; value: number; min?: number; max?: number } | { mode: 'hug' | 'fill'; min?: number; max?: number };
export type Layout = { mode: 'anchored'; anchor: Anchor; offset: { x: number; y: number }; width: Size; height: Size } | { mode: 'flow-child'; width: Size; height: Size; grow?: number };
export interface ChildrenLayout { mode: 'free' | 'row' | 'column'; gap: number; padding: number; align: 'start' | 'center' | 'end' | 'stretch'; justify: 'start' | 'center' | 'end' | 'space-between' }
export type Styled<T> = T | { tokenId: Id };
export interface Appearance {
  fill?: Styled<string>; textColor?: Styled<string>; fontFamily?: Styled<string>;
  fontSize?: Styled<number>; fontWeight?: Styled<number>; lineHeight?: Styled<number>;
  borderColor?: Styled<string>; borderWidth?: Styled<number>; radius?: Styled<number>;
  opacity?: number; shadow?: { x: number; y: number; blur: number; color: string };
}
export type Content = { kind: 'literal'; text: string } | { kind: 'binding'; variableId: Id; prefix?: string; suffix?: string };
export type Operand = { kind: 'literal'; value: Value } | { kind: 'variable'; variableId: Id };
export type Condition = { op: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte'; left: Operand; right: Operand } | { op: 'all' | 'any'; conditions: Condition[] } | { op: 'not'; condition: Condition };
export interface NodeOverride { layout?: Partial<Layout>; appearance?: Appearance; visible?: boolean; enabled?: boolean; content?: Content }
export interface NodeBase { id: Id; name: string; role?: string; layout: Layout; appearance: Appearance; visible: boolean; enabled: boolean; zIndex: number; viewportOverrides?: Record<Id, NodeOverride> }
export interface ContainerNode extends NodeBase { type: 'container'; children: Id[]; childrenLayout: ChildrenLayout }
export interface TextNode extends NodeBase { type: 'text'; content: Content }
export interface ImageNode extends NodeBase { type: 'image'; assetId: Id; fit: 'contain' | 'cover'; alt: string }
export interface ShapeNode extends NodeBase { type: 'shape'; shape: 'rectangle' | 'ellipse' | 'line' }
export interface InstanceNode extends NodeBase { type: 'instance'; componentId: Id; overrides: Record<string, Value> }
export type DesignNode = ContainerNode | TextNode | ImageNode | ShapeNode | InstanceNode;
export interface Component { id: Id; name: string; rootId: Id; exposed: Record<string, { nodeId: Id; propertyPath: string; type: 'string' | 'number' | 'boolean' }> }
export interface Screen { id: Id; name: string; rootId: Id; referenceViewportId: Id; viewportIds: Id[] }
export interface Viewport { id: Id; name: string; width: number; height: number }
export interface Token { id: Id; name: string; type: 'color' | 'number' | 'string'; value: string | number }
export interface Variable { id: Id; name: string; type: 'number' | 'string' | 'boolean'; default: Value }
export interface Scenario { id: Id; name: string; screenId: Id; values: Record<Id, Value>; visibility: Record<Id, boolean> }
export interface StateRule { id: Id; nodeId: Id; priority: number; when: Condition; overrides: Pick<NodeOverride, 'appearance' | 'visible' | 'enabled' | 'content'> }
export type Action = { type: 'navigate'; screenId: Id } | { type: 'setVariable'; variableId: Id; value: Value } | { type: 'incrementVariable'; variableId: Id; amount: number } | { type: 'setVisible'; nodeId: Id; value: boolean } | { type: 'setSelected'; nodeId: Id; value: boolean } | { type: 'resetScenario' };
export interface Interaction { id: Id; nodeId: Id; event: 'click' | 'pointerenter' | 'pointerleave'; when?: Condition; actions: Action[]; transition?: { property: 'opacity' | 'translate'; durationMs: number; easing: 'linear' | 'ease' } }
export interface DesignDocument {
  schemaVersion: 1; id: Id; name: string; kind: 'game' | 'web' | 'mobile';
  screens: Record<Id, Screen>; nodes: Record<Id, DesignNode>; components: Record<Id, Component>;
  tokens: Record<Id, Token>; viewports: Record<Id, Viewport>; variables: Record<Id, Variable>;
  scenarios: Record<Id, Scenario>; stateRules: Record<Id, StateRule>; interactions: Record<Id, Interaction>;
  assetIds: Id[];
}
export interface Scope { screenIds: Id[]; nodeIds: Id[]; componentIds: Id[]; tokenIds: Id[]; propertyPaths: string[] }
export interface Constraint { kind: 'equals' | 'range' | 'visible' | 'anchor' | 'reserved-region'; targetId: Id; propertyPath: string; value: unknown }
export interface Decision {
  id: Id; projectId: Id; title: string;
  status: 'pending' | 'exploring' | 'approved' | 'needs-review' | 'discarded';
  scope: Scope; rationale: string; softIntent: string; constraints: Constraint[];
  alternativeIds: Id[]; rejected: { alternativeId: Id; reason: string }[];
  approvedSnapshotId: Id | null; approvedFingerprints: Record<string, string>;
}
export interface ReferenceAnnotation { id: Id; assetId: Id; rect: { x: number; y: number; width: number; height: number }; note: string; preference: 'like' | 'avoid' | 'neutral' }
export interface CommandEnvelope<Operation> { requestId: Id; projectId: Id; workspaceId: Id; expectedRevision: number; operations: Operation[]; grantId?: Id }
export interface Workspace { id: Id; projectId: Id; kind: 'current' | 'alternative'; revision: number; document: DesignDocument; baseSnapshotId: Id | null }
export type JobStatus = 'queued' | 'running' | 'awaiting-user' | 'completed' | 'cancelled' | 'failed' | 'interrupted';
