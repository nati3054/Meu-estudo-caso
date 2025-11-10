import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  Button,
  HelperText,
  Surface,
} from "react-native-paper";
import { Produto } from "../scripts/produtoService";

interface FormValues {
  nome: string;
  preco: string;
}

interface Props {
  produto: Produto;
  loading: boolean;
  onChange: (name: keyof Produto, value: string) => void;
  onSubmit: (data?: FormValues) => void;
  onCancel: () => void;
}

const palette = {
  primary: "#6C63FF",
  text: "#1F1B2F",
  outline: "#DCD5FF",
  surface: "#FFFFFF",
};

export default function FormProduto({
  produto,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      nome: produto.nome,
      preco: produto.preco ? String(produto.preco) : "",
    },
  });

  useEffect(() => {
    setValue("nome", produto.nome);
    setValue("preco", produto.preco ? String(produto.preco) : "");
  }, [produto, setValue]);

  return (
    <Surface style={styles.surface} elevation={2}>
      <Controller
        control={control}
        name="nome"
        rules={{ required: "Nome obrigatorio" }}
        render={({ field: { onChange: onChangeField, value }, fieldState }) => (
          <View style={styles.field}>
            <TextInput
              label="Nome"
              value={value}
              onChangeText={(text) => {
                onChangeField(text);
                onChange("nome", text);
              }}
              mode="outlined"
              style={styles.input}
              autoFocus
              textColor={palette.text}
              selectionColor={palette.primary}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
              error={!!fieldState.error}
            />
            <HelperText type="error" visible={!!fieldState.error}>
              {fieldState.error?.message}
            </HelperText>
          </View>
        )}
      />
      <Controller
        control={control}
        name="preco"
        rules={{
          required: "Preco obrigatorio",
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: "Digite um valor valido",
          },
        }}
        render={({ field: { onChange: onChangeField, value }, fieldState }) => (
          <View style={styles.field}>
            <TextInput
              label="Preco"
              value={value}
              onChangeText={(text) => {
                const sanitized = text.replace(",", ".").replace(/[^0-9.]/g, "");
                onChangeField(sanitized);
                onChange("preco", sanitized);
              }}
              mode="outlined"
              keyboardType="decimal-pad"
              inputMode="decimal"
              style={styles.input}
              selectionColor={palette.primary}
              outlineColor={palette.outline}
              activeOutlineColor={palette.primary}
              textColor={palette.text}
              error={!!fieldState.error}
            />
            <HelperText type="error" visible={!!fieldState.error}>
              {fieldState.error?.message}
            </HelperText>
          </View>
        )}
      />
      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.primaryButton}
          labelStyle={styles.primaryButtonLabel}
          contentStyle={{ paddingVertical: 4 }}
          icon="content-save-outline"
        >
          Salvar
        </Button>
        <Button
          mode="text"
          onPress={onCancel}
          textColor={palette.primary}
          icon="arrow-left"
        >
          Cancelar
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: palette.surface,
    gap: 12,
  },
  field: {
    width: "100%",
  },
  input: {
    backgroundColor: palette.surface,
  },
  buttonGroup: {
    gap: 4,
  },
  primaryButton: {
    borderRadius: 12,
    backgroundColor: palette.primary,
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});
