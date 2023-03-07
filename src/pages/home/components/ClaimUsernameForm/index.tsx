import {Button, Text, TextInput} from "@ignite-ui/react";
import {ArrowRight} from "phosphor-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormAnnotation} from "./styles";
import { useRouter } from "next/router";

const ClaimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, {message: "O usuário deve ter no mínimo 3 caracteres."})
    .max(20, {message: "O usuário deve ter no máximo 20 caracteres."})
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens.",
    }) // aqui é onde você define a validação do seu formulário de cadastro de usuário
    .transform((value) => value.toLowerCase()), // transforma o valor para minúsculo
}); // aqui é onde você define o schema do seu formulário de cadastro de usuário

// schema basicamente é a validação do seu formulário de cadastro de usuário

type ClaimUsernameFormData = z.infer<typeof ClaimUsernameFormSchema>; // aqui é onde você define o tipo do seu formulário de cadastro de usuário

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(ClaimUsernameFormSchema), // resolver é onde você define o schema que você definiu acima para fazer a validação do formulário de cadastro de usuário
  }); // aqui é onde você define o formulário de cadastro de usuário com o tipo que você definiu acima

  const router = useRouter();

  async function handleClaimUserName(data: ClaimUsernameFormData) {
    const {username} = data;

    await router.push(`/register?username=${username}`); // aqui é onde você define a rota que você quer que o usuário vá quando ele clicar no botão de cadastro de usuário

  }

  return (
    <>
    <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="Seu nome de usuário"
        {...register("username")}
      />
      <Button size="sm" type="submit"  disabled={isSubmitting} >
        Reservar <ArrowRight />
      </Button>
      
    </Form>
    <FormAnnotation>
    <Text size="sm">
      {errors.username?.message || "Digite o nome desejado."}
    </Text>
  </FormAnnotation>
  </>
  );
}
