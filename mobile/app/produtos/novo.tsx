import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import produtoService, { Produto } from "../../scripts/produtoService";
import FormProduto from "../../components/FormProduto";

const palette = {
  background: "#F7F5FF",
  highlight: "#E4DEFF",
  text: "#1F1B2F",
  muted: "#6B6784",
};

export default function NovoProduto() {
  const [produto, setProduto] = useState<Produto>({ nome: "", preco: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name: keyof Produto, value: string) => {
    setProduto((prev) => ({
      ...prev,
      [name]: name === "preco" ? value : value,
    }));
  };

  const handleSubmit = async (data?: any) => {
    const nome = data?.nome ?? produto.nome;
    const precoStr = data?.preco ?? produto.preco;
    const preco =
      typeof precoStr === "string" ? parseFloat(precoStr) : precoStr;

    if (!nome || !preco) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      await produtoService.criar({ nome, preco });
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace("/produtos");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.backgroundAccent} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Novo Produto
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Complete os campos para adicionar um item ao catalogo.
            </Text>
          </View>
          <FormProduto
            produto={produto}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (router.canGoBack?.()) {
                router.back();
              } else {
                router.replace("/produtos");
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  backgroundAccent: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: palette.highlight,
    bottom: -60,
    right: -40,
    opacity: 0.6,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 6,
  },
  title: {
    color: palette.text,
    fontWeight: "700",
  },
  subtitle: {
    color: palette.muted,
  },
});
