import React from 'react';


export class Channel extends React.Component {

    click = () => {
        var myitem = document.querySelectorAll(".channel-item");
        
        for(var h=0; h<myitem.length; h++){
            myitem[h].addEventListener("click",function(e){
                var myitem = document.querySelectorAll(".channel-item");
    
                for(var i=0; i<myitem.length; i++){
                    myitem[i].classList.remove("bordered");
                }
                this.classList.add("bordered");    
            });
        }
        this.props.onClick(this.props.address);
    }

    render() {
        return (
            <div className='channel-item' onClick={this.click}>
                <div>{this.props.address}</div>
                {/* <span></span> highlist if new message has come */}
            </div>
        )
    }
}