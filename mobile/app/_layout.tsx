import { Stack } from "expo-router";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { useEffect } from "react";
import { StatusBar } from "react-native";

const palette = {
  primary: "#6C63FF",
  background: "#F7F5FF",
  surface: "#FFFFFF",
  text: "#1F1B2F",
};

const lavenderTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    surface: palette.surface,
    primary: palette.primary,
    text: palette.text,
    onSurface: palette.text,
    onBackground: palette.text,
  },
};

export default function RootLayout() {
  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor(palette.primary);
  }, []);

  return (
    <PaperProvider theme={lavenderTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.primary },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen name="produtos/index" options={{ title: "Lista" }} />
        <Stack.Screen
          name="produtos/novo"
          options={{ title: "Novo Produto" }}
        />
        <Stack.Screen
          name="produtos/[id]"
          options={{ title: "Editar Produto" }}
        />
      </Stack>
    </PaperProvider>
  );
}
