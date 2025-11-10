import React, { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Platform,
} from "react-native";
import {
  Card,
  Button,
  Text,
  FAB,
  Avatar,
  Chip,
  IconButton,
  Searchbar,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useRouter } from "expo-router";
import produtoService, { Produto } from "../../scripts/produtoService";

const palette = {
  background: "#F7F5FF",
  card: "#FFFFFF",
  primary: "#6C63FF",
  secondary: "#A78BFA",
  accent: "#FF6584",
  text: "#1F1B2F",
  muted: "#6B6784",
  highlight: "#E4DEFF",
  chip: "#EFE9FF",
};

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const carregarProdutos = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setErrorMessage(null);
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
      setProdutos([]);
      setErrorMessage(
        "Nao foi possivel carregar os produtos. Verifique sua conexao e tente novamente."
      );
      Alert.alert(
        "Erro",
        "Nao foi possivel carregar os produtos. Verifique sua conexao e tente novamente."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [carregarProdutos])
  );

  const filteredProdutos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return produtos;
    return produtos.filter((produto) =>
      `${produto.nome} ${produto.preco}`.toLowerCase().includes(term)
    );
  }, [produtos, search]);

  const hasSearch = search.trim().length > 0;

  const handleDelete = (id: number) => {
    const executarExclusao = async () => {
      try {
        await produtoService.excluir(id);
        setProdutos((listaAtual) =>
          listaAtual.filter((produto) => produto.id !== id)
        );
        await carregarProdutos(false);
      } catch (error) {
        console.error("Erro ao excluir produto", error);
        Alert.alert(
          "Erro",
          "Nao foi possivel excluir o produto. Tente novamente."
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmou =
        typeof globalThis !== "undefined" &&
        (globalThis as any).confirm?.("Deseja realmente excluir este produto?");
      if (confirmou) {
        executarExclusao();
      }
      return;
    }

    Alert.alert("Excluir Produto", "Deseja realmente excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: executarExclusao,
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Produtos</Text>
      <Text style={styles.headerSubtitle}>
        Controle o estoque, acompanhe precos e mantenha tudo atualizado.
      </Text>
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryValue}>{produtos.length}</Text>
          <Text style={styles.summaryLabel}>itens cadastrados</Text>
        </View>
        <IconButton
          icon="refresh"
          size={20}
          onPress={() => carregarProdutos(false)}
        />
      </View>
      <Searchbar
        placeholder="Buscar por nome ou preco"
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
        inputStyle={styles.searchbarInput}
        iconColor={palette.primary}
        placeholderTextColor={palette.muted}
        elevation={0}
      />
      <Button
        mode="outlined"
        icon="refresh"
        onPress={() => carregarProdutos(false)}
        loading={refreshing}
        style={styles.refreshButton}
        textColor={palette.text}
      >
        Atualizar lista
      </Button>
    </View>
  );

  const renderItem = ({ item }: { item: Produto }) => (
    <Card style={styles.productCard} mode="elevated">
      <Card.Title
        title={item.nome}
        titleStyle={styles.productTitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            size={44}
            icon="cube-outline"
            style={styles.productAvatar}
            color={palette.primary}
          />
        )}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.priceWrapper}>
          <Text style={styles.priceLabel}>Preco</Text>
          <Text style={styles.priceValue}>R$ {item.preco.toFixed(2)}</Text>
        </View>
        <Chip
          icon="identifier"
          compact
          style={styles.idChip}
          textStyle={styles.idChipText}
        >
          #{item.id ?? "N/I"}
        </Chip>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button
          mode="contained-tonal"
          onPress={() => router.push(`/produtos/${item.id}`)}
          icon="pencil-outline"
          style={styles.editButton}
          textColor={palette.primary}
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          textColor={palette.accent}
          onPress={() => handleDelete(item.id!)}
          icon="trash-can-outline"
        >
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderEmpty = () => {
    if (hasSearch && !errorMessage && produtos.length > 0) {
      return (
        <Card style={styles.emptyCard} mode="elevated">
          <Card.Content style={styles.emptyContent}>
            <Avatar.Icon
              size={48}
              icon="magnify"
              style={styles.emptyIcon}
              color={palette.primary}
            />
            <Text style={styles.emptyTitle}>Nada encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Ajuste os termos de busca para localizar o produto desejado.
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.emptyCard} mode="elevated">
        <Card.Content style={styles.emptyContent}>
          <Avatar.Icon
            size={48}
            icon={errorMessage ? "alert-circle-outline" : "clipboard-list-outline"}
            style={styles.emptyIcon}
            color={palette.primary}
          />
          <Text style={styles.emptyTitle}>
            {errorMessage ? "Erro ao carregar" : "Nenhum produto ainda"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {errorMessage ??
              "Comece cadastrando um produto para ver tudo organizado aqui."}
          </Text>
          <Button
            mode="contained"
            onPress={() =>
              errorMessage
                ? carregarProdutos(false)
                : router.push("/produtos/novo")
            }
            style={styles.emptyButton}
            icon={errorMessage ? "refresh" : "plus"}
          >
            {errorMessage ? "Tentar novamente" : "Adicionar produto"}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.backgroundAccent} />
      <FlatList
        data={filteredProdutos}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarProdutos(false)}
            colors={[palette.primary]}
            tintColor={palette.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          filteredProdutos.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/produtos/novo")}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  backgroundAccent: {
    position: "absolute",
    height: 260,
    width: 260,
    borderRadius: 130,
    backgroundColor: palette.highlight,
    top: -40,
    left: -60,
    opacity: 0.6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    gap: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: palette.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: palette.muted,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.card,
    shadowColor: palette.primary,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "700",
    color: palette.primary,
    lineHeight: 36,
  },
  summaryLabel: {
    fontSize: 14,
    color: palette.muted,
  },
  searchbar: {
    borderRadius: 16,
    backgroundColor: palette.card,
  },
  searchbarInput: {
    color: palette.text,
  },
  refreshButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    borderColor: palette.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.background,
    gap: 12,
    padding: 24,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 16,
  },
  productCard: {
    borderRadius: 20,
    backgroundColor: palette.card,
  },
  productAvatar: {
    backgroundColor: palette.chip,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.text,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  priceWrapper: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: palette.muted,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.primary,
  },
  idChip: {
    backgroundColor: palette.chip,
  },
  idChipText: {
    color: palette.text,
    fontWeight: "600",
  },
  cardActions: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editButton: {
    marginRight: 8,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: palette.primary,
    borderRadius: 32,
  },
  emptyCard: {
    borderRadius: 20,
    backgroundColor: palette.card,
  },
  emptyContent: {
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    backgroundColor: palette.chip,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.text,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    color: palette.muted,
    fontSize: 15,
    marginBottom: 4,
  },
  emptyButton: {
    borderRadius: 12,
    backgroundColor: palette.primary,
    marginTop: 4,
  },
});
