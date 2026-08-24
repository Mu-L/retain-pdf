use std::path::Path;

use crate::config::PythonWorkerEntrypointMode;

pub(super) struct CommandBuilder {
    parts: Vec<String>,
}

impl CommandBuilder {
    pub(super) fn new(
        python_bin: &str,
        mode: PythonWorkerEntrypointMode,
        entrypoint: &PythonEntrypoint<'_>,
        unbuffered: bool,
    ) -> Self {
        let parts = match mode {
            PythonWorkerEntrypointMode::Script => {
                let mut parts = vec![python_bin.to_string()];
                if unbuffered {
                    parts.push("-u".to_string());
                }
                parts.push(entrypoint.script_path.to_string_lossy().to_string());
                parts
            }
            PythonWorkerEntrypointMode::Console => vec![
                entrypoint.pipeline_command.to_string(),
                entrypoint.console_subcommand.to_string(),
            ],
        };
        Self { parts }
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

pub(super) struct PythonEntrypoint<'a> {
    script_path: &'a Path,
    pipeline_command: &'a str,
    console_subcommand: &'static str,
}

impl<'a> PythonEntrypoint<'a> {
    pub(super) fn new(
        script_path: &'a Path,
        pipeline_command: &'a str,
        console_subcommand: &'static str,
    ) -> Self {
        Self {
            script_path,
            pipeline_command,
            console_subcommand,
        }
    }
}
