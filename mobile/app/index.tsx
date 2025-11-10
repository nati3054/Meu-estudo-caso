import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import { Button, Card } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const palette = {
  primary: "#6C63FF",
  accent: "#FF6584",
  background: "#F7F5FF",
  highlight: "#E6E0FF",
  text: "#1F1B2F",
  muted: "#6B6784",
};

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.heroAccent} />
      <View style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
            }}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>
            Organize o catalogo, acompanhe valores e mantenha tudo sincronizado.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push("/produtos")}
            style={styles.ctaButton}
            labelStyle={styles.ctaButtonLabel}
            contentStyle={{ paddingVertical: 4 }}
            icon="format-list-bulleted"
          >
            Ir para Produtos
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heroAccent: {
    position: "absolute",
    height: 260,
    width: 260,
    borderRadius: 130,
    backgroundColor: palette.highlight,
    top: -70,
    right: -50,
    opacity: 0.7,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 28,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#fff",
    gap: 16,
  },
  illustration: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: palette.text,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: palette.muted,
    fontSize: 16,
  },
  ctaButton: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: palette.primary,
    marginTop: 8,
  },
  ctaButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
