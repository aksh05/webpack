let {Virtual} = window.interfaces;

const CircularLoader = (props)=>{
	return <div className={`preloader-wrapper ${props.size} active`}>
				    <div className="spinner-layer spinner-blue-only">
				      <div className="circle-clipper left">
				        <div className="circle"></div>
				      </div><div className="gap-patch">
				        <div className="circle"></div>
				      </div><div className="circle-clipper right">
				        <div className="circle"></div>
				      </div>
				    </div>
				  </div>;
}

CircularLoader.propTypes={size:Virtual.PropTypes.string}
CircularLoader.defaultProps={size:""}

export default CircularLoader;