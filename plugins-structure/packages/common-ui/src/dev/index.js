import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  MarkdownDiffHTML,
  MarkdownEditor,
  MarkdownRenderer,
  createEditorCommand,
} from "../components/Markdown";
import { MultiContentPage, SingleContentPage, TabsBanner } from "../layout";
import {
  Button,
  ButtonIcon,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  DarkLightToggle,
  H3,
  ThemeProvider,
  Toggle,
  defaultDarkTheme,
  defaultLightTheme,
  useTheme,
} from "pi-ui";
import "pi-ui/dist/index.css";
import {
  ModalConfirm,
  ModalExternalLink,
  ModalProvider,
  useModal,
} from "../components";

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme },
};

const customCommands = [
  {
    label: "Link",
    shift: true,
    commandKey: "l",
    Button: ({ onClick }) => <ButtonIcon type="link" onClick={onClick} />,
    command: (state) => {
      const { currentChange } = state;
      const { cursor, end, start } = currentChange.selection;
      const { previous, current, next } = cursor;
      const isCurrentEmpty = !current.length;
      state.currentState = {
        content: `${previous}[${current}]()${next}`,
        selectionStart: isCurrentEmpty ? start + 1 : end + 3,
        selectionEnd: isCurrentEmpty ? start + 1 : end + 3,
      };
    },
  },
  createEditorCommand({
    label: "Copy All",
    commandKey: "c",
    shift: true,
    buttonType: "copyToClipboard",
    command: (state) => {
      state.currentState.selectionEnd = state.currentState.content.length;
      state.currentState.selectionStart = 0;
    },
  }),
];

function MdTest() {
  const [old, setOld] = useState("");
  const [nw, setNew] = useState("");
  const [diffMode, setDiffMode] = useState(false);
  const [withCustomCommands, setCustomCommands] = useState(false);

  return (
    <>
      <H3>Diff Mode</H3>
      <Toggle onToggle={() => setDiffMode(!diffMode)} toggled={diffMode} />
      {diffMode ? (
        <div>
          <MarkdownEditor onChange={(e) => setOld(e)} />
          <MarkdownEditor onChange={(e) => setNew(e)} />
          <div
            style={{ width: "90%", border: "1px solid black", margin: "2rem" }}
          />
          <MarkdownDiffHTML oldText={old} newText={nw} />
        </div>
      ) : (
        <div>
          <H3>Toggle Custom Commands</H3>
          <Toggle
            onToggle={() => setCustomCommands(!withCustomCommands)}
            toggled={withCustomCommands}
          />
          <MarkdownEditor
            onChange={(e) => setNew(e)}
            customCommands={withCustomCommands ? customCommands : []}
          />
          <div
            style={{ width: "90%", border: "1px solid black", margin: "2rem" }}
          />
          <MarkdownRenderer body={nw} />
        </div>
      )}
    </>
  );
}

function ThemeButtons() {
  const { themeName, setThemeName } = useTheme();
  return (
    <div style={{ margin: "1rem", display: "flex", alignItems: "center" }}>
      Toggle Theme -
      <DarkLightToggle
        onToggle={() =>
          themeName === "dark"
            ? setThemeName(DEFAULT_LIGHT_THEME_NAME)
            : setThemeName(DEFAULT_DARK_THEME_NAME)
        }
        toggled={themeName === "dark"}
      />
    </div>
  );
}

function ModalButton() {
  const [open] = useModal();
  return (
    <div>
      <Button
        onClick={() =>
          open(ModalConfirm, {
            onSubmit: () => {
              console.log("confirmed");
            },
          })
        }
      >
        Modal Confirm
      </Button>
      <Button
        onClick={() => open(ModalExternalLink, { link: "https://github.com" })}
      >
        Modal External Link
      </Button>
    </div>
  );
}

ReactDOM.render(
  <ThemeProvider themes={themes} defaultThemeName={DEFAULT_DARK_THEME_NAME}>
    <ModalProvider>
      <MultiContentPage sidebar={<ThemeButtons />} banner={<h1>Markdown</h1>}>
        <div id="markdown-diff-wrapper">
          <ModalButton />
          <MdTest />
        </div>
      </MultiContentPage>
      <SingleContentPage
        banner={
          <TabsBanner
            tabs={[<>"Under Review"</>, "Test"]}
            title={<h1>Title</h1>}
          />
        }
      >
        <div id="markdown-diff-wrapper">
          Single content from fiuasbdfiubasiud
        </div>
      </SingleContentPage>
    </ModalProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
