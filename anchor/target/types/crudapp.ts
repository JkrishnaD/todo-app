/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crudapp.json`.
 */
export type Crudapp = {
  "address": "BRXt2Utc5TpK68EAvtFHwJKPR7DYWNsSaQEubMEusVfa",
  "metadata": {
    "name": "crudapp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createTodo",
      "discriminator": [
        250,
        161,
        142,
        148,
        131,
        48,
        194,
        181
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "todoEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "body",
          "type": "string"
        },
        {
          "name": "isDone",
          "type": "bool"
        }
      ]
    },
    {
      "name": "deleteTodo",
      "discriminator": [
        224,
        212,
        234,
        177,
        90,
        57,
        219,
        115
      ],
      "accounts": [
        {
          "name": "user",
          "signer": true
        },
        {
          "name": "todoDelete",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateTodo",
      "discriminator": [
        105,
        8,
        31,
        183,
        159,
        73,
        203,
        134
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "todoUpdate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "body",
          "type": "string"
        },
        {
          "name": "isDone",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "todoEntry",
      "discriminator": [
        97,
        221,
        222,
        9,
        124,
        204,
        208,
        45
      ]
    }
  ],
  "types": [
    {
      "name": "todoEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "body",
            "type": "string"
          },
          {
            "name": "isDone",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
