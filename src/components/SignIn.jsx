import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title, Input } from "../style/styles";

const SIGNIN_MUTATION = gql`
    mutation signin($userName:String!, $pwd:String!){
        signin(userName: $userName,pwd:$pwd){
            _id
            token
        }
    }
`
export default () => {
    const [session, setSession] = useRecoilState(sessionState);
    const [errorMessage, setErrorMessage] = useState("");
    const [siginMutation, {data}] = useMutation (SIGNIN_MUTATION,{
        onError(error){
            setSession({
                userid: "",
                token: "",
                logged: false,
            });

            
            if (error.message.includes("duplicate key")) {
                console.error("Usuario existente");
                setErrorMessage("Usuario existente");
              } else {
                setErrorMessage(
                  "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
                );
              }
        }
    })

const signin = (userName, pwd,pwd1) => {
    pwd===pwd1?
    siginMutation({
        variables:{userName,pwd},
    })
    :setErrorMessage('Contraseñas introducidas diferentes')
};

if(data){
    if(session.token !== data.signin.token){
        setSession({
            userid:data.signin._id,
            token:data.signin.token,
            logged: true,
        });
        setErrorMessage("");
    }
}
return(
    <SignIn>
        <Title>Signin</Title>
        {errorMessage!==""?<Error>{errorMessage}</Error>:null}
        {session.logged?(
            <OK>Usuario registrado correctamente</OK>
        ):
        (
            <SignIn>
                <Input id="userName" type="text" placeholder="Nombre de usuario">
                </Input>
                <Input id="pwd" type="password" placeholder="Contraseña"></Input>
                <Input id="pwd1" type="password" placeholder="Introduce de nuevo la Contraseña"></Input>
                <Button
                    onClick={() => {
                    signin(
                    document.getElementById("userName").value,
                    document.getElementById("pwd").value,
                    document.getElementById("pwd1").value
                    );
                }}
                >
                Registrar
                </Button>
            </SignIn>
        )}
    </SignIn>
)
}

const SignIn = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



const Button = styled.button`
  color: black;
  font-weight: bold;
  height: 30px;
  width: 500px;
  border: 1px solid #333;
  &:hover {
    background-color: #bbbbbb;
    cursor: pointer;
  }
`;

