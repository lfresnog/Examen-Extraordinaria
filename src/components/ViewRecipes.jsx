import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title, Input } from "../style/styles";
import Recipe from './Recipe'

const RECIPES_QUERY = gql `
    query recipes{
        recipes{
            _id
            title
        }
    }
`
export default () => {
    const [recipeID, setrecipeID] = useState(null);
    const {loading,error,data} = useQuery(RECIPES_QUERY);
    if (loading) return (<h1>Cargando...</h1>);
    if (error) return <p>{`${error}`}</p>
    return(
        data?
        <Recipes>
        <Options>
            {data.recipes.map((elem)=>{return <p onClick={()=>{setrecipeID(elem._id)}}>{elem.title}</p>})}
        </Options>
        {recipeID?
            <Recipe id={recipeID}/>
       :null}
        
        </Recipes>
        :null
    );
}

const Recipes = styled.div`
display: flex;
`

const Options = styled.div`
width: 20%;
text-align: center;
`