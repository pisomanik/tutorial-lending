
import { AptosParserRepo, getTypeTagFullname, StructTag, parseTypeTagOrThrow, u8, u64, u128, print, strToU8, u8str, DummyCache } from "@manahippo/move-to-ts";
import { AptosAccount, AptosClient, HexString, Types } from "aptos";
import { Command } from "commander";
import { getProjectRepo } from "./";
import * as fs from "fs";
import * as yaml from "yaml";
import * as Hippo_tutorial from './hippo_tutorial';

export const readConfig = (program: Command) => {
  const {config, profile} = program.opts();
  const ymlContent = fs.readFileSync(config, {encoding: "utf-8"});
  const result = yaml.parse(ymlContent);
  //console.log(result);
  if (!result.profiles) {
    throw new Error("Expect a profiles to be present in yaml config");
  }
  if (!result.profiles[profile]) {
    throw new Error(`Expect a ${profile} profile to be present in yaml config`);
  }
  const url = result.profiles[profile].rest_url;
  const privateKeyStr = result.profiles[profile].private_key;
  if (!url) {
    throw new Error(`Expect rest_url to be present in ${profile} profile`);
  }
  if (!privateKeyStr) {
    throw new Error(`Expect private_key to be present in ${profile} profile`);
  }
  const privateKey = new HexString(privateKeyStr);
  const client = new AptosClient(result.profiles[profile].rest_url);
  const account = new AptosAccount(privateKey.toUint8Array());
  console.log(`Using address ${account.address().hex()}`);
  return {client, account};
}

export async function sendPayloadTx(
  client: AptosClient,
  account: AptosAccount,
  payload: Types.TransactionPayload,
  max_gas=2000
){
  const txnRequest = await client.generateTransaction(account.address(), payload, {max_gas_amount: `${max_gas}`});
  const signedTxn = await client.signTransaction(account, txnRequest);
  const txnResult = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(txnResult.hash);
  const txDetails = (await client.getTransactionByHash(txnResult.hash)) as Types.UserTransaction;
  console.log(txDetails);
}

const program = new Command();

program
  .name('move-ts-cli')
  .description('Move TS CLI generated by move-to-ts')
  .requiredOption('-c, --config <path>', 'path to your aptos config.yml (generated with "aptos init")')
  .option('-p, --profile <PROFILE>', 'aptos config profile to use', 'default')


const lend2_admin_add_pool = async (CoinType: string, initial_price: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const initial_price_ = u64(initial_price);
  const payload = Hippo_tutorial.Lend2.buildPayload_admin_add_pool(initial_price_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:admin-add-pool")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<initial_price>')
  .action(lend2_admin_add_pool);


const lend2_admin_init = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_admin_init();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:admin-init")
  .description("")

  .action(lend2_admin_init);


const lend2_admin_update_price = async (CoinType: string, price: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const price_ = u64(price);
  const payload = Hippo_tutorial.Lend2.buildPayload_admin_update_price(price_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:admin-update-price")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<price>')
  .action(lend2_admin_update_price);


const lend2_borrow = async (CoinType: string, amount: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const amount_ = u64(amount);
  const payload = Hippo_tutorial.Lend2.buildPayload_borrow(amount_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:borrow")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<amount>')
  .action(lend2_borrow);


const lend2_create_fake_user1 = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_create_fake_user1();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:create-fake-user1")
  .description("")

  .action(lend2_create_fake_user1);


const lend2_create_fake_user2 = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_create_fake_user2();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:create-fake-user2")
  .description("")

  .action(lend2_create_fake_user2);


const lend2_create_fake_user3 = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_create_fake_user3();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:create-fake-user3")
  .description("")

  .action(lend2_create_fake_user3);


const lend2_deposit = async (CoinType: string, amount: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const amount_ = u64(amount);
  const payload = Hippo_tutorial.Lend2.buildPayload_deposit(amount_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:deposit")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<amount>')
  .action(lend2_deposit);


const lend2_init_fake_pools = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_init_fake_pools();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:init-fake-pools")
  .description("")

  .action(lend2_init_fake_pools);


const lend2_price_drop = async () => {
  const {client, account} = readConfig(program);

  const payload = Hippo_tutorial.Lend2.buildPayload_price_drop();
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:price-drop")
  .description("")

  .action(lend2_price_drop);


const lend2_repay = async (CoinType: string, amount: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const amount_ = u64(amount);
  const payload = Hippo_tutorial.Lend2.buildPayload_repay(amount_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:repay")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<amount>')
  .action(lend2_repay);


const lend2_withdraw = async (CoinType: string, amount: string) => {
  const {client, account} = readConfig(program);
  const CoinType_ = parseTypeTagOrThrow(CoinType);
  const amount_ = u64(amount);
  const payload = Hippo_tutorial.Lend2.buildPayload_withdraw(amount_, [CoinType_]);
  await sendPayloadTx(client, account, payload);
}

program
  .command("lend2:withdraw")
  .description("")
  .argument('<TYPE_CoinType>')
  .argument('<amount>')
  .action(lend2_withdraw);


const lend2_get_all_users = async () => {
  const {client, account} = readConfig(program);
  const repo = getProjectRepo();
  const value = await Hippo_tutorial.Lend2.query_get_all_users(client, account, repo, [])
  print(value);
}

program
  .command("lend2:query-get-all-users")

  .action(lend2_get_all_users)




program.parse();
