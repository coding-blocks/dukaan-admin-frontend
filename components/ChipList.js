import React from 'react';
import ChipItem from "./ChipItem";

function ChipList(props) {

    const productList = props.productList;
    const limit = 6;

    return (
        <div>
            { productList.length >= limit ?
                <div className="my-4 py-2 row no-gutters px-md-5 px-4">
                    {productList.slice(0, limit).map((pill) => {
                        return <ChipItem name={pill}/>
                    })}
                </div> : false
            }
            <a href="#">
                <div className="font-mds orange mt-3 px-md-6 px-5">View All</div>
            </a>
        </div>
    )
}

export default ChipList;