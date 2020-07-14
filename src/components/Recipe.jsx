import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title, Input } from "../style/styles";

const RECIPE_QUERY = gql `
    query recipe($id:ID!){
        recipe(id:$id){
            title,
            description,
            mainImage{
                url
            },
            steps{
                image{
                    url
                },
                description
            },
            date,
            ingredients{
                name
            }
        }
    }
`

export default (props) => {
    const {loading,error,data} = useQuery(RECIPE_QUERY,{
        variables:{id:props.id}
    });

    if (loading) return (<h1>Cargando...</h1>);
    if (error) return <p>{`${error}`}</p>

    return(
        data?
            <Recipe>
                <Info>
                    <h1>{data.recipe.title}</h1>
                    <Image src={`http://77.228.91.193/${data.recipe.mainImage.url}`} />
                    <p>{data.recipe.description}</p>
                    {data.recipe.steps.map((elem)=>{return <Step url={elem.image.url} description={elem.description}/>})}
                </Info>
                <Extra>
                    <h4>{data.recipe.date}</h4>
                    <Ingredients>
                    <h3>Ingredients:</h3>
                    {data.recipe.ingredients.map((elem)=>{return <p>{elem.name}</p>})}
                    </Ingredients>
                </Extra>
            </Recipe>
        
        :null
    )

}

function Step(props){
    return(
        <Step_info>
        <Image_Step src={`http://77.228.91.193/${props.url}`} />
        <p>{props.description}</p>
        </Step_info>
    );
}

const Image = styled.img`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 400px;
  
`;

const Image_Step = styled.img`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 40%;
  object-fit: contain;
`;

const Recipe = styled.div`
display: flex;
justify-content: flex-end;
width: 70%;
height: fit-content;
`

const Info = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
width: 70%;
`

const Extra = styled.div`
display: flex;
flex-direction: column;
align-items: flex-end;
`

const Ingredients = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
`
const Step_info = styled.div`
display: flex;
`
