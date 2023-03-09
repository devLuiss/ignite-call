import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {ArrowRight, CheckCircle} from "phosphor-react";
// import { api } from "../../../lib/axios"
import {Container, Header} from "../styles";
import {AuthError, ConnectBox, ConnectItem} from "./styles";

export default function ConnectCalendar() {
  const router = useRouter();
  const session = useSession();

  const hasAuthError = !!router.query?.error;
  const hasSignedIn = session.status === "authenticated";



  async function handleConnectCalendar() {
    await signIn("google");
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {hasSignedIn ? (
            <Button disabled>
              Conectado
              <CheckCircle />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError && (
          <AuthError>
            Não foi possível conectar sua conta do Google. Tente novamente.
          </AuthError>
        )}
        <Button type="submit" disabled={!hasSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}