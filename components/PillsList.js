import React from 'react';
import PillItem from "./PillItem";

function PillsList() {

    const productList = ['ISJV2342','ISJV2342','ISJV2342','ISJV2342','ISJV2342','ISJV2342','ISJV2342'];
    const limit = 6;

    return (
        <div>
            <div className="row no-gutter px-md-5 px-4" >
                {productList.slice(0,limit).map((pill)=>{
                    return <PillItem value={pill} />
                })}
            </div>
            <a href="#">
                <div className="font-mds orange mt-3 px-md-6 px-5">View All</div>
            </a>
        </div>
    )
}

export default PillsList;