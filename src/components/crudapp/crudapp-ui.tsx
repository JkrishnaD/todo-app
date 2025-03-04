"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useCrudappProgram,
  useCrudappProgramAccount,
} from "./crudapp-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function CrudappCreate() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isDone, setIsDone] = useState(false);
  const { createTodo } = useCrudappProgram();
  const { publicKey } = useWallet();

  const isVerified = title.trim() && body.trim() != "";

  const onSubmit = () => {
    if (publicKey && isVerified) {
      createTodo.mutateAsync({
        title,
        body,
        is_done: isDone,
        owner: publicKey as PublicKey,
      });
    }
  };

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return (
    <div className="flex w-full max-w-4xl space-y-4 items-center justify-center flex-col">
      <input
        type="text"
        placeholder="todo title"
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full max-w-2xl"
      />
      <textarea
        placeholder="todo description"
        onChange={(e) => setBody(e.target.value)}
        className="textarea textarea-bordered w-full max-w-2xl"
      />
      <button className="flex flex-row space-x-2">
        <input type="checkbox" onChange={(e) => setIsDone(e.target.checked)} />
        <span>Mark as completed</span>
      </button>
      <button
        onClick={onSubmit}
        disabled={!isVerified}
        className="btn btn-primary"
      >
        Create Todo
      </button>
    </div>
  );
}

export function CrudappList() {
  const { accounts, getProgramAccount } = useCrudappProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CrudappCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function CrudappCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateTodo, deleteTodo } = useCrudappProgramAccount({
    account,
  });

  const { publicKey } = useWallet();
  const title = accountQuery.data?.title;
  const [body, setBody] = useState("");
  const [isDone, setIsDone] = useState(false);

  const isValid = body.trim() != "";

  if (!publicKey) {
    return <p>connect your wallet</p>;
  }

  if (!title) {
    return <p>failed to fetch the title from account...</p>;
  }

  const handleUpdate = () => {
    if (publicKey && isValid) {
      updateTodo.mutateAsync({
        title,
        body,
        is_done: isDone,
        owner: publicKey,
      });
    }
  };

  return accountQuery.isLoading ? (
    <span className="loading-spinner loading loading-lg" />
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card card-body flex items-center flex-col text-center">
        <div className="space-y-4">
          <h1 onClick={() => accountQuery.refetch()} className="cursor-pointer">
            {accountQuery.data?.title}
          </h1>
          <p>{accountQuery.data?.body}</p>
          <div className="space-y-4 card-actions justify-around">
            <textarea
              placeholder="todo description"
              onChange={(e) => setBody(e.target.value)}
              className="textarea textarea-bordered w-full max-w-2xl"
            />
            <div className="flex flex-row">
              <button
                onClick={handleUpdate}
                disabled={updateTodo.isPending || !isValid}
                className="btn btn-xs btn-primary lg:btn-md"
              >
                Update Todo
              </button>
              <button
                onClick={() => deleteTodo.mutate()}
                disabled={deleteTodo.isPending}
                className="btn btn-xs btn-primary lg:btn-md"
              >
                Delete Todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
