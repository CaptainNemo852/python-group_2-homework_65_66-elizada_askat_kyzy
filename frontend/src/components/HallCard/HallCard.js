import React from 'react';
import HallDisplayCard from "../../components/UI/HallDisplayCard/HallDisplayCard";

const HallCard = function (props) {
    const {hall, onDelete} = props;
    const {name, id} = hall;
    const link = {
      url: '/halls/' + id,
      text: "Больше..."
    };

    return <HallDisplayCard name={name} link={link.url} link_text={link.text} deleteHall={onDelete}/>

};

export default HallCard;