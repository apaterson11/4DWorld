import { useEffect, useCallback, useState, memo } from 'react';
import { Card } from './Card';
import axiosInstance from '../axios';
import update from 'immutability-helper';
const style = {
    width: 400,
};

export const Container = (props) => {
    {
        let options = ''
        //console.log(props.layerlandmarks)
        if (props.layerlandmarks) {
            options = props.layerlandmarks
            .sort((a,b) => a.position > b.position ? 1 : -1)
            .map(e => (
                {
                    id: parseInt(`${e.id}`),
                    text: `${e.content}`.slice(0, 50),
                }
            ));
        }

        // useEffect(() => {
        //     if (props.layerlandmarks) {
        //         options = props.layerlandmarks.map(e => (
        //             {
        //                 id: parseInt(`${e.id}`),
        //                 text: `${e.content}`,
        //             }
        //         ));
        //     }
        // });
        
        //console.log(options)

        const [cards, setCards] = useState(
            options
            // options[0], options[1], options[2], options[3],
            // {
            //     id: 1,
            //     text: 'Write a cool JS library',
            // },
            // {
            //     id: 2,
            //     text: 'Make it generic enough',
            // },
            // {
            //     id: 3,
            //     text: 'Write README',
            // },
            // {
            //     id: 4,
            //     text: 'Create some examples',
            // },
            // {
            //     id: 5,
            //     text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            // },
            // {
            //     id: 6,
            //     text: '???',
            // },
            // {
            //     id: 7,
            //     text: 'PROFIT',
            // },
        );

        // useEffect(() => 
        //     setCards(options), [cards]
        // );

        //console.log(cards)

        const moveCard = useCallback((dragIndex, hoverIndex) => {
            const dragCard = cards[dragIndex];
            console.log(props.layerlandmarks[dragCard.id])

            setCards(update(cards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }));
        }, [cards]);
        console.log(cards)

        let marker = ''
        cards.forEach((card, index) => {
                // if (marker.id != landmark_id) {
            marker = cards[index]
            console.log(marker.id)
            const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
                            position: index,
                        }).then(response => {
                            props.rerenderParentCallback()
                        })
            })

        const renderCard = (card, index) => {
            return (<Card key={card.id} index={index} id={card.id} text={card.text} moveCard={moveCard}/>);
        };

        return (<>
				<div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
            </>);
    }
};
export default memo(Container);