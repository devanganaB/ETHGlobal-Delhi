# codingrag.py
from hyperon import MeTTa, E, S, ValueAtom

class CodingRAG:
    def __init__(self, metta_instance: MeTTa):
        self.metta = metta_instance

    def query_topics(self):
        """Fetch available topics."""
        results = self.metta.run('!(match &self (topic $t) $t)')
        return [str(r[0]) for r in results if r]

    def get_requirements(self):
        """Fetch coding question requirements."""
        results = self.metta.run('!(match &self (requirement $r $v) (concat $r ":" $v))')
        return [str(r[0]) for r in results if r]

    def add_knowledge(self, relation_type, subject, object_value):
        """Dynamically add topics or requirements."""
        if isinstance(object_value, str):
            object_value = ValueAtom(object_value)
        self.metta.space().add_atom(E(S(relation_type), S(subject), object_value))
        return f"Added {relation_type}: {subject} → {object_value}"
