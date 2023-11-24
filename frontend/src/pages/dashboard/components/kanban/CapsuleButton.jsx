
const CapsuleButton = ( { text , handler ,children} ) => {

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#9BBEC8',
    color: '#164863',
    borderRadius: '20px',
    margin: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    fontWeight: '450', 
  };
  

    if(handler == null){
        handler = () => {}
    }
    return (
      <button style={ buttonStyle } onClick={handler}>
        {children}
        {text} 
      </button>
    );
  };

export default CapsuleButton