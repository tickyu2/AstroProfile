from neo4j import GraphDatabase
from .config import EngineConfig

class Neo4jGraphStore:
    def __init__(self,cfg: EngineConfig):
        self.driver=GraphDatabase.driver(cfg.neo4j_uri, auth=(cfg.neo4j_user,cfg.neo4j_password))
    def ensure_schema(self):
        with self.driver.session() as s:
            s.run('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE')
    def upsert_user(self,user_id,tags):
        with self.driver.session() as s:
            s.run('MERGE (u:User {userId:$u}) SET u.tags=$t, u.updatedAt=datetime()', u=user_id, t=tags)
    def save_match(self,m):
        a,b=sorted([m.user_id,m.candidate_id]); key=f'{a}::{b}'
        with self.driver.session() as s:
            s.run('MERGE (a:User{userId:$a}) MERGE (b:User{userId:$b}) MERGE (a)-[r:MATCHED{pairKey:$k}]->(b) SET r.score=$s, r.reasons=$r, r.explain=$e, r.updatedAt=datetime()', a=a,b=b,k=key,s=m.total_score,r=m.reasons,e=m.explain)
