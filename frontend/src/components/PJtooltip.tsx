import React, { useState } from 'react';
import { PJtooltipWrap } from './NavStyle';

const PJtooltip = () => {
    const [showTooltip , setShowTooltip] = useState(false);

    return (
        <PJtooltipWrap>
            <button 
            onMouseEnter={()=>setShowTooltip(true)}
            onMouseDown={()=>setShowTooltip(false)}
            ></button>
        </PJtooltipWrap>
    );
};

export default PJtooltip;