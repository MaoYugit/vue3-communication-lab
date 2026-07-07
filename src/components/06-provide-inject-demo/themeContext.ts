import type { InjectionKey } from "vue";
import type { DeepReadonly, Ref } from "vue";

export interface ThemeContext {
  theme: DeepReadonly<Ref<string>>;
  toggleTheme: () => void;
}

export const themeContextKey: InjectionKey<ThemeContext> = Symbol("themeContext");
