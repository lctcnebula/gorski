import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../src/lib/server/db";
import { encrypt } from "../src/lib/server/security";
import { deliverPending } from "../src/lib/server/push";

async function main() {
  const sql=database();
  const id=randomUUID(), device="qa-"+randomUUID();
  let delivered=0;
  try {
    await sql`INSERT INTO submissions(id,kind,payload) VALUES(${id},'appointments',${encrypt({name:'Private test patient'})})`;
    await sql`INSERT INTO push_subscriptions(id,payload) VALUES(${device},${encrypt({endpoint:'https://fcm.googleapis.com/qa-only',keys:{auth:'qa',p256dh:'qa'}})})`;
    await sql`INSERT INTO push_deliveries(submission_id,subscription_id) VALUES(${id},${device})`;
    await deliverPending(async (_sub,payload) => {
      delivered++; assert.ok(payload); const notification=JSON.parse(String(payload));
      assert.equal(notification.title,'New website submission'); assert.ok(!String(payload).includes('Private test patient'));
      assert.equal(notification.url,'/admin?id='+id);
      return {statusCode:201,headers:{},body:''};
    });
    assert.equal(delivered,1);
    const sent=await sql`SELECT state FROM push_deliveries WHERE submission_id=${id}`;assert.equal(sent[0].state,'sent');
    await deliverPending(async()=>{throw new Error('Already delivered job was repeated');});
    await sql`UPDATE push_deliveries SET state='pending' WHERE submission_id=${id}`;
    await deliverPending(async()=>{throw Object.assign(new Error('Expired'),{statusCode:410});});
    assert.equal((await sql`SELECT id FROM push_subscriptions WHERE id=${device}`).length,0);
    console.log('PASS: push queue, private notification payload, delivery state, no duplicate resend, expired-device removal.');
  } finally {
    await sql`DELETE FROM submissions WHERE id=${id}`;
    await sql`DELETE FROM push_subscriptions WHERE id=${device}`;
  }
}
main().catch(()=>{console.error('Push queue test failed.');process.exitCode=1;});
