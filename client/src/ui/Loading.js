import loader from '../assets/loader.svg'

const Loading = ({width, height, style}) => {
    return(
        <img
        src={loader}
        className="rotate"
        width={width}
        height={height}
        style={style}
      />
    )
}
export default Loading