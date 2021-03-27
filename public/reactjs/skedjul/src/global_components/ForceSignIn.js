import { IfFirebaseAuthedAnd, IfFirebaseUnAuthed } from "@react-firebase/auth"
import { Redirect } from "react-router-dom"

export default function ForceSignIn(Inner) {
  return (
    <div>
      <IfFirebaseAuthedAnd filter={({ providerId }) => providerId !== "anonymous"}>
        {() => {
          return(Inner)
        }}
      </IfFirebaseAuthedAnd>
      <IfFirebaseUnAuthed>
        <Redirect push to='/signin' />
      </IfFirebaseUnAuthed>
    </div>
  );
}