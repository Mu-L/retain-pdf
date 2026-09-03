use std::path::Path;

pub(super) struct CommandBuilder {
    parts: Vec<String>,
}

impl CommandBuilder {
    pub(super) fn new(pipeline_command: &str, console_subcommand: &'static str) -> Self {
        Self {
            parts: vec![
                pipeline_command.to_string(),
                console_subcommand.to_string(),
            ],
        }
    }

    pub(super) fn arg(&mut self, name: &str, value: impl ToString) {
        self.parts.push(name.to_string());
        self.parts.push(value.to_string());
    }

    pub(super) fn path_arg(&mut self, name: &str, value: &Path) {
        self.arg(name, value.to_string_lossy());
    }

    pub(super) fn finish(self) -> Vec<String> {
        self.parts
    }
}
