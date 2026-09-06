mod csv;
mod entries;
mod records;

pub(crate) use csv::parse_glossary_csv;
#[cfg(test)]
use csv::parse_glossary_csv_text;
pub(crate) use entries::resolve_task_glossary_request;
#[cfg(test)]
use entries::{merge_glossary_entries, normalize_glossary_entries, MAX_GLOSSARY_ENTRIES};
pub(crate) use records::{
    create_glossary, delete_glossary, filter_glossaries, list_glossaries, load_glossary_or_404,
    update_glossary,
};

#[cfg(test)]
mod tests;
