# &lt;LazilyLoad /&gt;

## Introduction

- Use this component to lazily load dependecies of your component.
- Internally its uses require js to load dependecies.

## Demo

## How to use?

```javascript
{
    const dependecies = {
        Component1 : "path to some Component1 file",
        Component2 : "path to some Component2 file
    };
    
    const renderFunction = ({Component1,Component2})=>{
        return <Component1>
                    <Component2 />
                </Component1>;
    }
    
    return <LazilyLoad module={dependencies}>{renderFunction}</LazilyLoad>;
}
```

## Advanced Usage

### Reducer and css file as dependecies

```javascript
{
    const dependecies = {
        Component : "path to Component file",
        reducer : "path to reducer file",
        styles : "path to styles file"
    };
    
    const renderFunction = ({Component,reducer,styles})=>{
        return <UpdateStoreAndStyles reducer={reducer} styles={styles}>
                    <Component />
                </UpdateStoreAndStyles>;
               
    }
    
    return <LazilyLoad module={dependencies}>{renderFunction}</LazilyLoad>;
}

```