import {Button, Heading, MultiStep, Text, TextInput} from "@ignite-ui/react";
import {ArrowRight} from "phosphor-react";
import {useForm} from "react-hook-form";
import {Container, Form, FormError, Header} from "./styles";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {api} from "../../lib/axios";
import {AxiosError} from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, {message: "O usuário precisa ter pelo menos 3 letras."})
    .regex(/^([a-z\\-]+)$/i, {
      message: "O usuário pode ter apenas letras e hifens.",
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, {message: "O nome precisa ter pelo menos 3 letras."}),
}); // aqui é onde você define a validação do seu formulário de cadastro de usuário

type RegisterFormData = z.infer<typeof registerFormSchema>; // aqui é onde você define o tipo do seu formulário de cadastro de usuário

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<RegisterFormData>({resolver: zodResolver(registerFormSchema)}); // aqui é onde você define o formulário de cadastro de usuário com o tipo que você definiu acima

  const router = useRouter();

  useEffect(() => {
    if (router.query?.username) {
      setValue("username", router.query.username as string);
    } else {
      router.push("/");
    }
  }, [router.query?.username, setValue]); // usando o useeffect para pegar o username da url e colocar no input de username do formulário de cadastro

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push("/register/connect-calendar");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        return alert("Usuário já existe!");
      }
    }
  }
  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register("username")}
          />

          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register("name")} />

          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
