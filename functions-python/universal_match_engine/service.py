from .config import EngineConfig
from .models import BirthInput
from .feature_extractor import vectorize
from .pgvector_store import PgVectorStore
from .neo4j_graph_store import Neo4jGraphStore
from .scorer import score_pair
import json

class UniversalCompatibilityEngine:
    def __init__(self,cfg=None):
        self.cfg=cfg or EngineConfig(); self.pg=PgVectorStore(self.cfg); self.graph=Neo4jGraphStore(self.cfg)
    def ensure_schema(self): self.pg.ensure_schema(); self.graph.ensure_schema()
    def upsert_user_profile(self,user_id,birth,psych=None):
        p=vectorize(user_id,birth,psych); self.pg.upsert(p); self.graph.upsert_user(user_id,p.archetype_tags); return p
    def match_user(self,user_id,birth,psych=None):
        me=self.upsert_user_profile(user_id,birth,psych)
        rows=self.pg.shortlist(user_id,self.cfg.shortlist_k)
        out=[]
        for cand_id,sim,tags_json,features_json in rows:
            try: tags=tags_json if isinstance(tags_json,list) else json.loads(tags_json)
            except Exception: tags=['sun:Gemini','moon:Taurus','rising:Libra']
            try: cfeat=features_json if isinstance(features_json,dict) else json.loads(features_json)
            except Exception: cfeat={}
            m=score_pair(self.cfg,user_id,cand_id,float(sim),me.archetype_tags,tags,
                         psych_user=psych or {}, psych_cand={}, user_features=me.features, cand_features=cfeat)
            out.append(m)
        out.sort(key=lambda x:x.total_score, reverse=True)
        top=out[:self.cfg.top_n]
        for m in top: self.graph.save_match(m)
        return top
