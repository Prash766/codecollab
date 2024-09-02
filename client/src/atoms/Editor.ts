import { MutableRefObject, useRef } from "react";
import { atom } from "recoil";

type Obj = {
  socketid: string;
  username: string;
};

export const CodeAtom = atom<string>({
  key: "codeatom",
  default: `function add(a, b) {\n  return a + b;\n}`,
});

export const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarAtom",
  default: false,
});

export const isDarkModeAtom = atom<boolean>({
  key: "isDarkModeAtom",
  default: true,
});

export const joinedClients = atom<Array<Obj>>({
  key: "joinedClientsatom",
  default: [],
});

