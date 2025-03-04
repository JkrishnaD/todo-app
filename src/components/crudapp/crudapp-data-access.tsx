"use client";

import { getCrudappProgram, getCrudappProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import toast from "react-hot-toast";

interface CreateTodoArgs {
  title: string;
  body: string;
  is_done: boolean;
  owner: PublicKey;
}

export function useCrudappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getCrudappProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getCrudappProgram(provider, programId),
    [provider, programId]
  );

  const accounts = useQuery({
    queryKey: ["crudapp", "all", { cluster }],
    queryFn: () => program.account.todoEntry.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createTodo = useMutation<string, Error, CreateTodoArgs>({
    mutationKey: [`todoEntry`, `create`, { cluster }],
    mutationFn: async ({ title, body, is_done, owner }) => {
      return program.methods.createTodo(title, body, is_done).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createTodo,
  };
}

export function useCrudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useCrudappProgram();

  const accountQuery = useQuery({
    queryKey: ["crudapp", "fetch", { cluster, account }],
    queryFn: () => program.account.todoEntry.fetch(account),
  });

  const updateTodo = useMutation<string, Error, CreateTodoArgs>({
    mutationKey: [`todoEntry`, `update`, { cluster }],
    mutationFn: async ({ title, body, is_done }) => {
      return program.methods.updateTodo(title, body, is_done).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteTodo = useMutation({
    mutationKey: [`todoEntry`, `delete`, { cluster }],
    mutationFn: () => {
      return program.methods.deleteTodo().rpc();
    },

    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
  });

  return {
    accountQuery,
    updateTodo,
    deleteTodo,
  };
}
