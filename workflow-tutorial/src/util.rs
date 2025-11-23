// TODO: this should be generated or moved to SDK
use crate::obelisk::types::execution::JoinSet;
use std::hash::Hash;

impl PartialEq for JoinSet {
    fn eq(&self, other: &Self) -> bool {
        self.id() == other.id()
    }
}
impl Eq for JoinSet {}

impl Hash for JoinSet {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.id().hash(state);
    }
}
