from sqlalchemy import create_engine, text
import json
from .config import EngineConfig

class PgVectorStore:
    def __init__(self,cfg: EngineConfig):
        self.cfg=cfg; self.engine=create_engine(cfg.pg_dsn, future=True)
    def ensure_schema(self):
        with self.engine.begin() as c:
            c.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))
            c.execute(text(f"CREATE TABLE IF NOT EXISTS {self.cfg.pg_vector_table} (user_id text primary key, vector vector({self.cfg.vector_dim}), features_json jsonb not null, tags_json jsonb not null, updated_at timestamptz default now())"))
    def upsert(self,p):
        vec=p.vector[:self.cfg.vector_dim] + [0.0]*max(0,self.cfg.vector_dim-len(p.vector))
        vl='['+','.join(f'{x:.8f}' for x in vec)+']'
        with self.engine.begin() as c:
            c.execute(text(f"INSERT INTO {self.cfg.pg_vector_table}(user_id,vector,features_json,tags_json) VALUES (:u, CAST(:v AS vector), CAST(:f AS jsonb), CAST(:t AS jsonb)) ON CONFLICT(user_id) DO UPDATE SET vector=EXCLUDED.vector,features_json=EXCLUDED.features_json,tags_json=EXCLUDED.tags_json,updated_at=now()"), {'u':p.user_id,'v':vl,'f':json.dumps(p.features),'t':json.dumps(p.archetype_tags)})
    def shortlist(self,user_id,k=300):
        with self.engine.begin() as c:
            rows=c.execute(text(f"WITH me AS (SELECT vector v FROM {self.cfg.pg_vector_table} WHERE user_id=:u) SELECT p.user_id, 1-(p.vector <=> (SELECT v FROM me)) sim, p.tags_json, p.features_json FROM {self.cfg.pg_vector_table} p WHERE p.user_id<>:u ORDER BY p.vector <=> (SELECT v FROM me) LIMIT :k"), {'u':user_id,'k':k}).fetchall()
        return rows
