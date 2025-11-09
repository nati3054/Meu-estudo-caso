import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { Card, Button, Text, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import produtoService, { Produto } from "../../scripts/produtoService";

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const carregarProdutos = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert("Excluir Produto", "Deseja realmente excluir este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        // Use replace para evitar empilhar a navegacao ao recarregar a lista
        onPress: async () => {
          try {
            await produtoService.excluir(id);
            router.replace("/produtos");
          } catch (error) {
            console.error("Erro ao excluir produto", error);
            Alert.alert(
              "Erro",
              "Nao foi possivel excluir o produto. Tente novamente."
            );
          }
        },
      },
    ]);
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Card.Title
              title={item.nome}
              subtitle={`R$ ${item.preco.toFixed(2)}`}
            />
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => router.replace(`/produtos/${item.id}`)}
                style={{ marginRight: 8 }}
              >
                Editar
              </Button>
              <Button
                mode="outlined"
                textColor="#d32f2f"
                onPress={() => handleDelete(item.id!)}
              >
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ textAlign: "center", marginBottom: 12 }}>
              {errorMessage ?? "Nenhum produto cadastrado."}
            </Text>
            {errorMessage && (
              <Button mode="outlined" onPress={carregarProdutos}>
                Tentar novamente
              </Button>
            )}
          </View>
        }
      />
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: "#1976d2",
        }}
        onPress={() => router.replace("/produtos/novo")}
        color="#fff"
      />
    </View>
  );
}
