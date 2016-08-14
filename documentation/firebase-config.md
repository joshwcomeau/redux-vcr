# Firebase Configuration

By default, ReduxVCR uses Firebase v3.2 for data persistence.



### Step 1: Sign up for Firebase and create a project

Head on over to firebase.google.com and sign up for a free account. Once you make it to [the console](https://console.firebase.google.com/), click 'CREATE NEW PROJECT'.

Select a name and region, and click 'CREATE PROJECT'.



### Step 2: Set up Authentication

In traditional apps, we'd set up some kind of OAuth provider, so that we can authenticate our Firebase database with Facebook or Twitter login. In this case, though, we want to allow all users (even anonymous ones) to write to the database, since we still want to record their actions!

Thankfully, Firebase has a concept of "anonymous authentication".

The idea is pretty simple: You make a request, on page load, to authenticate anonymously. The server generates a temporary ID, and the client can then use that ID to make authenticated requests. The ID is lost when the session ends, or the page is refreshed, which makes it perfect for our needs.

We need to enable anonymous authentication. In the left-hand menu, select 'Auth'. Then, from the header, select 'SIGN-IN METHOD'.

Click on 'Anonymous', the final option in the list of providers, and enable it.



### Step 3: Configure the rules for the project

We've now authenticated all users who connect to Firebase, but we need to set up authorization, so that our anonymous users can't wreak havoc or spy on other users.

Firebase works with a JSON-like set of rules for controlling access, as well as other config like setting up indexes, or validating write requests.

We want all users to be able to write to their own slice of the database, but we don't want them to be able to read from the database at all.

In the left-hand menu, click 'Database', and then select 'RULES' from the main header.

Here are the rules you'll want to implement:

// TODO: Update when Firebase support gets back to me.

```js
{
  "rules": {
    ".read": true,
    "cassettes": {
      ".indexOn": ["timestamp"],
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    },
    "actions": {
      "$uid": {
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```
