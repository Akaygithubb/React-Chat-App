import { Box, Button, Container, HStack, Input, VStack } from "@chakra-ui/react";
import Message from "./Components/Message";
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { app } from "./Firebase";
import { useState, useEffect, useRef } from "react";
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const LoginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logouthandler = () => {
  signOut(auth);
};

function App() {
  const [user, setuser] = useState(false);
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const divforscroll = useRef(null);

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setmessage("");
      await addDoc(collection(db, "messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdat: serverTimestamp()
      });
      divforscroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdat", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setuser(data);
    });

    const unsubscribebeforemessage = onSnapshot(q, (snap) => {
      setmessages(snap.docs.map((item) => {
        const id = item.id;
        return { id, ...item.data() };
      }));
    });

    return () => {
      unsubscribe();
      unsubscribebeforemessage();
    };
  }, []);

  return (
    <Box bg={"pink.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button w={"full"} colorScheme={"yellow"} onClick={logouthandler}>
              LogOut
            </Button>
            <VStack h={"full"} w={"full"} overflowX={"auto"} css={{"&: :-webkit-scrollbar":{
              display:"none"
            }}}>
              {messages.map((item) => (
                <Message
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === user.uid ? "me" : "other"}
                />
              ))}
              <div ref={divforscroll}></div>
            </VStack>
            <form style={{ width: "100%" }} onSubmit={submithandler}>
              <HStack>
                <Input
                  placeholder="Enter a Message ....."
                  value={message}
                  onChange={(e) => {
                    setmessage(e.target.value);
                  }}
                />
                <Button type="submit" colorScheme={"red"}>
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg={"red.50"} h={"100vh"} justifyContent={"center"}>
          <Button colorScheme="green" onClick={LoginHandler}>
            Sign In with Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
