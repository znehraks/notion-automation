import dotenv from 'dotenv';
dotenv.config(); // 여기서 한 번만 호출
import { Client } from "@notionhq/client";


// TODO 
/**
 * Notion API 이것 저것 사용하면서 사용법 익히기
 * CRUD 이것저것 해보기
 * Lambda 연동하기(cron job 추가)
 */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});


async function test() {
  const response = await notion.users.list({
    page_size: 100,
  });

  const targetPage = await notion.pages.retrieve({
    page_id: process.env.NOTION_PAGE_KEY as string
  })

  console.log(targetPage);

  // const databases = await notion.search({
  //   page_size: 100,
  //   filter:{
  //     property: "object",
  //     value: "database"
  //   }
  // });

  // console.log(databases);
}

// test();


