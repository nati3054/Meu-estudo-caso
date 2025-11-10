import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import produtoService, { Produto } from "../../scripts/produtoService";
import FormProduto from "../../components/FormProduto";

const palette = {
  background: "#F7F5FF",
  highlight: "#E4DEFF",
  text: "#1F1B2F",
  muted: "#6B6784",
  primary: "#6C63FF",
};

export default function EditarProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto>({ nome: "", preco: 0 });
  const [loadingProduto, setLoadingProduto] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoadingProduto(true);
      produtoService
        .obter(Number(id))
        .then((data) => {
          setProduto({ nome: data.nome, preco: data.preco });
        })
        .finally(() => setLoadingProduto(false));
    }
  }, [id]);

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
    setSaving(true);
    try {
      await produtoService.atualizar(Number(id), { nome, preco });
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace("/produtos");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingProduto) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </SafeAreaView>
    );
  }

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
              Editar Produto
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Atualize as informacoes e salve para sincronizar com o sistema.
            </Text>
          </View>
          <FormProduto
            produto={produto}
            loading={saving}
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
  backgroundAccent: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: palette.highlight,
    top: -60,
    right: -40,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.background,
    gap: 12,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 16,
  },
});
