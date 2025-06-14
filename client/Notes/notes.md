## 21/05/2025

> **Why setTimeout used ?**

![alt text](image.png)

`getSubCatById` and `getBySizeId` this two api called in each iteration of their `forEach` loop.

So, it takes time to complete each `forEach` Loop.
Thus, used setTimeout.

_Othervise_, it sets initial value of `prev` variable which is empty array.

> **code suggetor IDE `IntelliJ`, `jetBrain`**

- vs extension
  ![alt text](image-3.png)

- Free for javascript and typescript (for profetional usage it may charge)
  ![alt text](image-1.png)

- another is Void
  ![alt text](image-2.png)

---

<br>
<br>

## 28/05/2025

> Why setTimeout used in below code ?

```javascript
const popupContainer = useRef(null);

useEffect(() => {
  function handleClickOutside(event) {
    // console.log('Event listener triggered..');
    // console.log('event.target', event.target);
    // console.log('popupContainer.current', popupContainer.current);
    // console.log('popupContainer.current.contains(event.target)', popupContainer.current.contains(event.target));
    if (
      popupContainer.current &&
      !popupContainer.current.contains(event.target)
    ) {
      setIsSubCatListOpen(false);
    }
  }

  if (isSubCatListOpen) {
    setTimeout(
      () => document.addEventListener("click", handleClickOutside),
      [300]
    );
  }

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [isSubCatListOpen]);
```

<br>

## Close popup by clicking it on outside and don't close when click on popup itself

- A button to open a popup dialog
- A popup that closes if you click outside of it
- Clicking inside the popup does nothing

```js
import React, { useRef, useState, useEffect } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ padding: "50px" }}>
      <button onClick={() => setIsOpen(true)}>Open Popup</button>

      {isOpen && (
        <div
          ref={popupRef}
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            width: "200px",
          }}
        >
          <p>This is a popup!</p>
        </div>
      )}
    </div>
  );
}

export default App;
```

### 🔍 When does below code run?

```js
return () => {
  document.removeEventListener("mousedown", handleClickOutside);
};
```

React runs the **cleanup** function in these situations:

- **when useEffect's dependancies changges, useEffect's inner function runs,**
- **Before this useEffect's inner function runs, it first runs return function with previous value of dependancies**
- When the component unmounts

<br>

### What below condisition says

```js
if (popupRef.current && !popupRef.current.contains(event.target))
```

1. **`popupRef.current`**

   - This checks whether the popup DOM element currently **exists** (i.e. the popup is open).

   - If it’s null, the popup isn't on the screen.

2. **`if(!popupRef.current.contains(event.target))`**

   - **event.target :** It is html element which is clicked by user.

   ```jsx
   // popupRef.current element
   <div
     ref={popupRef}
     style={{
       marginTop: "20px",
       padding: "20px",
       background: "#fff",
       border: "1px solid #ccc",
       boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
       width: "200px",
     }}
   >
     <p>This is a popup!</p>
   </div>
   ```

   - This checks if the click happened outside the popup.

   - event.target is the element that was clicked.

   - .contains() returns true if the clicked element is inside the popup — so !contains(...) means it's outside.

## # Incorrect : assignment of varible inside JSX Return

```js
arr.map((val, idx) => (
  <div>
    {(temp = val)} // Should not use assignment inside JSX
    {console.log("temp", temp)}
    ...some code
  </div>
));
```

**Corrected Code :**

```js
arr.map((val, idx) => {
  const temp = val;
  console.log("temp", temp);

  return <div>...some code</div>;
});
```

## # Incorrect : copy array state into a varible

```js
const [arrayState, setArrayState] = useState(["val-1", "val-2"]);

// in some where
function someFunc() {
  console.log("Before arrayState", arrayState);
  // output : Before arrayState ['val-1','val-2','val-n']
  const tempArr = arrayState;
  let x = "Val-n";
  tempArr.push(x);
  console.log("After arrayState", arrayState);
  // output : After arrayState ['val-1','val-2','val-n']
}

console.log("arrayState", arrayState);
// output : arrayState ['val-1','val-2']
somefunc();

useEffect(() => {
  // by calling someFunc(), this useEffect will not triggered
  console.log("arrayState useEffect Triggered");
}, [arrayState]);
```

- In above code, `tempArr = arrayState`
  ,this create refference to `arrayState`
- Means, tempArr not just have value of `arrayState` but its has also its refference
- Means, If we change value of `tempArr` it will directly change value of `arrayState`.
- Still `arrayState` is a **useState** , so by updating it, it should trigger **useEffect** hook.
- But by updating state by this way , **useEffect will not triggered**.

### Correct Way

```js
function someFunc() {
  const x = "val-n";
  const newArray = [...arrayState];
  newArray.push(x);
  setArrayState(newArray); // triggers re-render and useEffect
}
```

## forEach() return will not work .

```js
function someFunc(name, arr) {
  arr.forEach((val) => {
    if (val.name === name) {
      return val; // even if condition match, return of forEach will not work.
    }
  });
}

const valObj = someFunc("John", dataList);
```

**Solution :** use `for...of` loop.

## mongoose response query is not JS object.

```js
const response = await Emp.find({ name: "EmpName" });

console.log(Obejct.keys(response).include("salary")); // true

delete response.salary; // this JS object operation will not work,

console.log(Obejct.keys(response).include("salary")); // true
```

- JS Object operations or function will not directly work on mongoose `response`
- dataType of mongoose `response` is **mongoose ducoment not JS Object**

**Solution :**

```js
const response = await Emp.find({ name: "EmpName" });
console.log(Obejct.keys(response).include("salary")); // true

const cleaned_Response = reponse.toObject();

delete cleaned_Response.salary; // now, it will run

console.log(Obejct.keys(cleaned_Response).include("salary")); // false
```

## VS code sticky Scroll

![alt text](image-4.png)

<br>
<br>

## custome react hook

### useIsFirstRender()

- differentiat whether component renders fisrt time or not ?
  https://usehooks.com/useisfirstrender

### useDebounce()

- use in SEARCH BAR
- if user don't change input field till 500 millisecond, then only we want to call API, then use this
- _Note : if we use setTimeOut(), then it runs every time when input change_
  https://usehooks.com/usedebounce

```
npm i @uidotdev/usehooks
```

## Mongoose query's response-object's mutation

```js
const result = await DB_MODEL.findById(id);
console.log(result); // { name: 'John', age: 32 }

result.age = 50;
result.city = "New York";

console.log(result); // { name: 'John', age: 32 }
```

- Above result object is mongoose's object not a javascript object,
- we can't change mongoose object.
- if we want javascript objectinstead of mongoose, then we have to use `.lean()`.
- then we can change result object

```js
const result = await DB_MODEL.findById(id).lean();
console.log(result); // { name: 'John', age: 32 }

result.age = 50;
result.city = "New York";

console.log(result); // { name: 'John', age: 50, city: "New York" }
```
-----
#### *Another Point to Note*
- If we store image in mongoDB *(mongo stores image in buffer)* and we query to get that image,then `image's buffer` only be in mongoose object, buffer can't converted to JS object.
- If we showing im age fetched from mongoDB, then we have to use mongo object, not JS object.
----
