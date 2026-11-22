-- Base contractual para migración H0. No ejecutada en esta entrega.
-- UUIDs generados por aplicación; todas las fechas son UTC.
CREATE TABLE projects (
 id uuid PRIMARY KEY, name text NOT NULL, kind text NOT NULL CHECK(kind IN ('game','web','mobile')),
 brief text NOT NULL DEFAULT '', archived_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE snapshots (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 document jsonb NOT NULL, decisions jsonb NOT NULL, reason text NOT NULL,
 source_revision bigint NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(project_id,id)
);
CREATE TABLE workspaces (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 kind text NOT NULL CHECK(kind IN ('current','alternative')), title text NOT NULL,
 revision bigint NOT NULL DEFAULT 1 CHECK(revision > 0), document jsonb NOT NULL,
 base_snapshot_id uuid, base_current_revision bigint,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(project_id,id),
 FOREIGN KEY(project_id,base_snapshot_id) REFERENCES snapshots(project_id,id)
);
CREATE UNIQUE INDEX one_current_per_project ON workspaces(project_id) WHERE kind='current';
CREATE TABLE decisions (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE design_actions (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id), workspace_id uuid NOT NULL,
 request_id uuid NOT NULL, request_hash text NOT NULL, actor text NOT NULL CHECK(actor IN ('owner','agent')),
 revision_before bigint NOT NULL, revision_after bigint NOT NULL,
 command jsonb NOT NULL, document_before jsonb NOT NULL, document_after jsonb NOT NULL,
 decisions_before jsonb NOT NULL, decisions_after jsonb NOT NULL, result jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(project_id,request_id),
 FOREIGN KEY(project_id,workspace_id) REFERENCES workspaces(project_id,id),
 CHECK(revision_after=revision_before+1)
);
-- También para approve/restore/apply, exports y creación de alternativas.
CREATE TABLE request_results (
 project_id uuid NOT NULL REFERENCES projects(id), request_id uuid NOT NULL,
 request_hash text NOT NULL, response jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(project_id,request_id)
);
CREATE TABLE assets (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 storage_key text NOT NULL UNIQUE, sha256 text NOT NULL, mime_type text NOT NULL,
 size_bytes bigint NOT NULL CHECK(size_bytes>=0), original_name text NOT NULL,
 annotations jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE agent_sessions (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 claude_session_id text, workspace_key text NOT NULL, cli_version text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE jobs (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id),
 kind text NOT NULL CHECK(kind IN ('agent','export')), status text NOT NULL,
 payload jsonb NOT NULL, result jsonb, lease_until timestamptz, cancel_requested boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(status IN ('queued','running','awaiting-user','completed','cancelled','failed','interrupted'))
);
CREATE INDEX queue_jobs ON jobs(status,created_at);
CREATE TABLE job_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, job_id uuid NOT NULL REFERENCES jobs(id),
 type text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_by_job ON job_events(job_id,id);
CREATE TABLE grants (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id), job_id uuid NOT NULL REFERENCES jobs(id),
 command_hash text NOT NULL, expected_revision bigint NOT NULL, scope jsonb NOT NULL,
 expires_at timestamptz NOT NULL, consumed_at timestamptz
);
CREATE TABLE exports (
 id uuid PRIMARY KEY, project_id uuid NOT NULL REFERENCES projects(id), snapshot_id uuid NOT NULL,
 job_id uuid NOT NULL REFERENCES jobs(id), mode text NOT NULL CHECK(mode IN ('draft','approved','project')),
 storage_key text, manifest jsonb, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(project_id,snapshot_id) REFERENCES snapshots(project_id,id)
);
CREATE TABLE owner_account (
 id smallint PRIMARY KEY CHECK(id=1), password_hash text NOT NULL
);
CREATE TABLE owner_sessions (
 token_hash text PRIMARY KEY, owner_id smallint NOT NULL REFERENCES owner_account(id),
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
-- Consistencia de payload JSONB, referencias de assets/decisions, job.project_id y grants
-- se valida en dominio dentro de la transacción; nunca confiar solo en este DDL.
