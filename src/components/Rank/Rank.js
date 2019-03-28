import React from 'react';

//simple component with no state pure function
const Rank = () => {
    return (
       <div>
           <div className='white f3'>
               {'Ahmed, your current rank is...'}
           </div>
           <div className='white f1'>
               {'#5'}
           </div>
       </div>
    );
}


export default Rank;