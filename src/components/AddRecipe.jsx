import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title, Input } from "../style/styles";
import UploadFile from "./UploadFile";

const INGEDIENTS_LIST_QUERY = gql`
  {
    ingredients {
      _id
      name
    }
  }
`;



const ADDRECIPE_MUTATION = gql `
  mutation addRecipe($userid: ID!, $token:String!, $title:String!, $description:String!, $description_step:String!, $image_url:String!, $ingredients:[ID!], $mainImage_url:String!){
    addRecipe(userid:$userid, token:$token, title:$title, description:$description,steps:{description:description_step,image:{url:$image_url,mimetype:"image/jpeg",encoding:"binary"}},ingredients:$ingredients,mainImage:{url:$mainImage_url,mimetype:"image/jpeg",encoding:"binary"}){
      title
    }
  }
`

export default () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useRecoilState(sessionState);
  const ingredients = [];
  const [ing,setIng] = useState(null);
  const { loading, error, data } = useQuery(INGEDIENTS_LIST_QUERY);
  const [addRecipe, {data: dataRecipe, loading: mutationLoading, error: mutationError }] = useMutation(ADDRECIPE_MUTATION); 
  if (loading) return <p>Cargando lista de ingredientes...</p>;
  if (error) return <p>Error cargando la lista de ingredientes...</p>;

  return (
    <div>
      <Input id="title" type="text" placeholder="Title"></Input>
      <Input id="description" type="text" placeholder="Description"></Input>
      <Input id="description_step1" type="text" placeholder="Step 1"></Input>
      <Input id="description_step2" type="text" placeholder="Step 2"></Input>
      <Input id="description_step3" type="text" placeholder="Step 3"></Input>
      <Input id="imagen_step1" type="text" placeholder="Imagen 1"></Input>
      <Input id="imagen_step2" type="text" placeholder="Imagen 2"></Input>
      <Input id="imagen_step3" type="text" placeholder="Imagen 3"></Input>
      <Input id="imagen_recipe" type="text" placeholder="Iamgen receta"></Input>
      {data.ingredients.map(({ _id, name }) => (
        <Ingredients>
          <p  onclick={()=>{ingredients.push(_id)}} key={_id}>{name}</p>
        </Ingredients>
      ))}
      <p>{ingredients}</p>
      <Button
                    onClick={(e) => {e.preventDefault();
                      addRecipe({variables:{title:document.getElementById("title").value,
                      _id:session.userid,
                      token:session.token,
                      description:document.getElementById("description").value,
                      steps:[{description:document.getElementById("description_step1"),image:{url:document.getElementById("description_step1")}},
                      {description:document.getElementById("description_step2"),image:{url:document.getElementById("description_step2")}},
                      {description:document.getElementById("description_step3"),image:{url:document.getElementById("description_step3")}}],
                      ingredients:ingredients,
                      mainImage:document.getElementById("imagen_recipe").value,
                    }})
                }}
                >
                Guardar receta
                </Button>

                {mutationLoading?
            <p>{`Loading...`}</p>
         :mutationError?
            <p>{`${`Error crear la receta`}`}</p>
         :dataRecipe?
            <p>{` Receta creada`}</p>
        :null}
    </div>
  );
};


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

const Ingredients = styled.div`
display: flex;
`;