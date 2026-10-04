import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/guard";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// StoreKit 2 Receipt Tokens from C:\tmauto\locket\locketgold.py
const TOKEN_CONFIG = {
  fetch_token:
    "eyJhbGciOiJFUzI1NiIsIng1YyI6WyJNSUlFTVRDQ0E3YWdBd0lCQWdJUVI4S0h6ZG41NTRaL1VvcmFkTng5dHpBS0JnZ3Foa2pPUFFRREF6QjFNVVF3UWdZRFZRUURERHRCY0hCc1pTQlhiM0pzWkhkcFpHVWdSR1YyWld4dmNHVnlJRkpsYkdGMGFXOXVjeUJEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURUxNQWtHQTFVRUN3d0NSell4RXpBUkJnTlZCQW9NQ2tGd2NHeGxJRWx1WXk0eEN6QUpCZ05WQkFZVEFsVlRNQjRYRFRJMU1Ea3hPVEU1TkRRMU1Wb1hEVEkzTVRBeE16RTNORGN5TTFvd2daSXhRREErQmdOVkJBTU1OMUJ5YjJRZ1JVTkRJRTFoWXlCQmNIQWdVM1J2Y21VZ1lXNWtJR2xVZFc1bGN5QlRkRzl5WlNCU1pXTmxhWEIwSUZOcFoyNXBibWN4TERBcUJnTlZCQXNNSTBGd2NHeGxJRmR2Y214a2QybGtaU0JFWlhabGJHOXdaWElnVW1Wc1lYUnBiMjV6TVJNd0VRWURWUVFLREFwQmNIQnNaU0JKYm1NdU1Rc3dDUVlEVlFRR0V3SlZVekJaTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEEwSUFCTm5WdmhjdjdpVCs3RXg1dEJNQmdyUXNwSHpJc1hSaTBZeGZlazdsdjh3RW1qL2JIaVd0TndKcWMyQm9IenNRaUVqUDdLRklJS2c0WTh5MC9ueW51QW1qZ2dJSU1JSUNCREFNQmdOVkhSTUJBZjhFQWpBQU1COEdBMVVkSXdRWU1CYUFGRDh2bENOUjAxREptaWc5N2JCODVjK2xrR0taTUhBR0NDc0dBUVVGQndFQkJHUXdZakF0QmdnckJnRUZCUWN3QW9ZaGFIUjBjRG92TDJObGNuUnpMbUZ3Y0d4bExtTnZiUzkzZDJSeVp6WXVaR1Z5TURFR0NDc0dBUVVGQnpBQmhpVm9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQXpMWGQzWkhKbk5qQXlNSUlCSGdZRFZSMGdCSUlCRlRDQ0FSRXdnZ0VOQmdvcWhraUc5Mk5rQlFZQk1JSCtNSUhEQmdnckJnRUZCUWNDQWpDQnRneUJzMUpsYkdsaGJtTmxJRzl1SUhSb2FYTWdZMlZ5ZEdsbWFXTmhkR1VnWW5rZ1lXNTVJSEJoY25SNUlHRnpjM1Z0WlhNZ1lXTmpaWEIwWVc1alpTQnZaaUIwYUdVZ2RHaGxiaUJoY0hCc2FXTmhZbXhsSUhOMFlXNWtZWEprSUhSbGNtMXpJR0Z1WkNCamIyNWthWFJwYjI1eklHOW1JSFZ6WlN3Z1kyVnlkR2xtYVdOaGRHVWdjRzlzYVdONUlHRnVaQ0JqWlhKMGFXWnBZMkYwYVc5dUlIQnlZV04wYVdObElITjBZWFJsYldWdWRITXVNRFlHQ0NzR0FRVUZCd0lCRmlwb2RIUndPaTh2ZDNkM0xtRndjR3hsTG1OdmJTOWpaWEowYVdacFkyRjBaV0YxZEdodmNtbDBlUzh3SFFZRFZSME9CQllFRklGaW9HNHdNTVZBMWt1OXpKbUdOUEFWbjNlcU1BNEdBMVVkRHdFQi93UUVBd0lIZ0RBUUJnb3Foa2lHOTJOa0Jnc0JCQUlGQURBS0JnZ3Foa2pPUFFRREF3TnBBREJtQWpFQStxWG5SRUM3aFhJV1ZMc0x4em5qUnBJelBmN1ZIejlWL0NUbTgrTEpsclFlcG5tY1B2R0xOY1g2WFBubGNnTEFBakVBNUlqTlpLZ2c1cFE3OWtuRjRJYlRYZEt2OHZ1dElETVhEbWpQVlQzZEd2RnRzR1J3WE95d1Iya1pDZFNyZmVvdCIsIk1JSURGakNDQXB5Z0F3SUJBZ0lVSXNHaFJ3cDBjMm52VTRZU3ljYWZQVGp6Yk5jd0NnWUlLb1pJemowRUF3TXdaekViTUJrR0ExVUVBd3dTUVhCd2JHVWdVbTl2ZENCRFFTQXRJRWN6TVNZd0pBWURWUVFMREIxQmNIQnNaU0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURVRNQkVHQTFVRUNnd0tRWEJ3YkdVZ1NXNWpMakVMTUFrR0ExVUVCaE1DVlZNd0hoY05NakV3TXpFM01qQXpOekV3V2hjTk16WXdNekU1TURBd01EQXdXakIxTVVRd1FnWURWUVFERER0QmNIQnNaU0JYYjNKc1pIZHBaR1VnUkdWMlpXeHZjR1Z5SUZKbGJHRjBhVzl1Y3lCRFpYSjBhV1pwWTJGMGFXOXVJRUYxZEdodmNtbDBlVEVMTUFrR0ExVUVDd3dDUnpZeEV6QVJCZ05WQkFvTUNrRndjR3hsSUVsdVl5NHhDekFKQmdOVkJBWVRBbFZUTUhZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUNJRFlnQUVic1FLQzk0UHJsV21aWG5YZ3R4emRWSkw4VDBTR1luZ0RSR3BuZ24zTjZQVDhKTUViN0ZEaTRiQm1QaENuWjMvc3E2UEYvY0djS1hXc0w1dk90ZVJoeUo0NXgzQVNQN2NPQithYW85MGZjcHhTdi9FWkZibmlBYk5nWkdoSWhwSW80SDZNSUgzTUJJR0ExVWRFd0VCL3dRSU1BWUJBZjhDQVFBd0h3WURWUjBqQkJnd0ZvQVV1N0Rlb1ZnemlKcWtpcG5ldnIzcnI5ckxKS3N3UmdZSUt3WUJCUVVIQVFFRU9qQTRNRFlHQ0NzR0FRVUZCekFCaGlwb2RIUndPaTh2YjJOemNDNWhjSEJzWlM1amIyMHZiMk56Y0RBekxXRndjR3hsY205dmRHTmhaek13TndZRFZSMGZCREF3TGpBc29DcWdLSVltYUhSMGNEb3ZMMk55YkM1aGNIQnNaUzVqYjIwdllYQndiR1Z5YjI5MFkyRm5NeTVqY213d0hRWURWUjBPQkJZRUZEOHZsQ05SMDFESm1pZzk3YkI4NWMrbGtHS1pNQTRHQTFVZER3RUIvd1FFQXdJQkJqQVFCZ29xaGtpRzkyTmtCZ0lCQkFJRkFEQUtCZ2dxaGtqT1BRUURBd05vQURCbEFqQkFYaFNxNUl5S29nTUNQdHc0OTBCYUI2NzdDYUVHSlh1ZlFCL0VxWkdkNkNTamlDdE9udU1UYlhWWG14eGN4ZmtDTVFEVFNQeGFyWlh2TnJreFUzVGtVTUkzM3l6dkZWVlJUNHd4V0pDOTk0T3NkY1o0K1JHTnNZRHlSNWdtZHIwbkRHZz0iLCJNSUlDUXpDQ0FjbWdBd0lCQWdJSUxjWDhpTkxGUzVVd0NnWUlLb1pJemowRUF3TXdaekViTUJrR0ExVUVBd3dTUVhCd2JHVWdVbTl2ZENCRFFTQXRJRWN6TVNZd0pBWURWUVFMREIxQmNIQnNaU0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURVRNQkVHQTFVRUNnd0tRWEJ3YkdVZ1NXNWpMakVMTUFrR0ExVUVCaE1DVlZNd0hoY05NVFF3TkRNd01UZ3hPVEEyV2hjTk16a3dORE13TVRneE9UQTJXakJuTVJzd0dRWURWUVFEREJKQmNIQnNaU0JTYjI5MElFTkJJQzBnUnpNeEpqQWtCZ05WQkFzTUhVRndjR3hsSUVObGNuUnBabWxqWVhScGIyNGdRWFYwYUc5eWFYUjVNUk13RVFZRFZRUUtEQXBCY0hCc1pTQkpibU11TVFzd0NRWURWUVFHRXdKVlV6QjJNQkFHQnlxR1NNNDlBZ0VHQlN1QkJBQWlBMklBQkpqcEx6MUFjcVR0a3lKeWdSTWMzUkNWOGNXalRuSGNGQmJaRHVXbUJTcDNaSHRmVGpqVHV4eEV0WC8xSDdZeVlsM0o2WVJiVHpCUEVWb0EvVmhZREtYMUR5eE5CMGNUZGRxWGw1ZHZNVnp0SzUxN0lEdll1VlRaWHBta09sRUtNYU5DTUVBd0hRWURWUjBPQkJZRUZMdXczcUZZTTRpYXBJcVozcjY5NjYvYXl5U3JNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEZ1lEVlIwUEFRSC9CQVFEQWdFR01Bb0dDQ3FHU000OUJBTURBMmdBTUdVQ01RQ0Q2Y0hFRmw0YVhUUVkyZTN2OUd3T0FFWkx1Tit5UmhIRkQvM21lb3locG12T3dnUFVuUFdUeG5TNGF0K3FJeFVDTUcxbWloREsxQTNVVDgyTlF6NjBpbU9sTTI3amJkb1h0MlFmeUZNbStZaGlkRGtMRjF2TFVhZ002QmdENTZLeUtBPT0iXX0.eyJ0cmFuc2FjdGlvbklkIjoiNTQwMDAyNjk1MjcxNDQzIiwib3JpZ2luYWxUcmFuc2FjdGlvbklkIjoiNTQwMDAxODcwMTU4NDc0Iiwid2ViT3JkZXJMaW5lSXRlbUlkIjoiNTQwMDAwODc4Mjc2NjAzIiwiYnVuZGxlSWQiOiJjb20ubG9ja2V0LkxvY2tldCIsInByb2R1Y3RJZCI6ImxvY2tldF8xNjAwXzF5Iiwic3Vic2NyaXB0aW9uR3JvdXBJZGVudGlmaWVyIjoiMjE0MTk0NDciLCJwdXJjaGFzZURhdGUiOjE3ODY2OTcyMzcwMDAsIm9yaWdpbmFsUHVyY2hhc2VEYXRlIjoxNzQwNDk1MjU5MDAwLCJleHBpcmVzRGF0ZSI6MTgxODIzMzIzNzAwMCwicXVhbnRpdHkiOjEsInR5cGUiOiJBdXRvLVJlbmV3YWJsZSBTdWJzY3JpcHRpb24iLCJkZXZpY2VWZXJpZmljYXRpb24iOiJTY2lCV1ZBMVozc1ovWGNKMk1TOExYNG9BUEg2dlB4TnhPcjBqZ3RpalNQckNWbEpFb2dqOVFxdlpWKzh6U3M4IiwiZGV2aWNlVmVyaWZpY2F0aW9uTm9uY2UiOiJhYzhhYzM5MC1iNDVhLTQzZjQtYjIzMS1iYjBjYzUxZDcyOWIiLCJpbkFwcE93bmVyc2hpcFR5cGUiOiJQVVJDSEFTRUQiLCJzaWduZWREYXRlIjoxNzg2Njk3MjQ4NzgxLCJlbnZpcm9ubWVudCI6IlByb2R1Y3Rpb24iLCJ0cmFuc2FjdGlvblJlYXNvbiI6IlBVUkNIQVNFIiwic3RvcmVmcm9udCI6IlZOTSIsInN0b3JlZnJvbnRJZCI6IjE0MzQ3MSIsInByaWNlIjozOTkwMDAwMDAsImN1cnJlbmN5IjoiVk5EIiwiYXBwVHJhbnNhY3Rpb25JZCI6IjcwNDI3MjE5OTMxNTM1ODU2OSIsImJpbGxpbmdQbGFuVHlwZSI6IkJJTExFRF9VUEZST05UIn0.Lw9Q-8THicVoT18rzH58JmMBTyjaPF3Dno6LkGCrGFu2i2d5jwCtsoGteFAltz5XDPvhDEjwZtJy92kqvF75gQ",
  app_transaction:
    "eyJhbGciOiJFUzI1NiIsIng1YyI6WyJNSUlFTVRDQ0E3YWdBd0lCQWdJUVI4S0h6ZG41NTRaL1VvcmFkTng5dHpBS0JnZ3Foa2pPUFFRREF6QjFNVVF3UWdZRFZRUURERHRCY0hCc1pTQlhiM0pzWkhkcFpHVWdSR1YyWld4dmNHVnlJRkpsYkdGMGFXOXVjeUJEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURUxNQWtHQTFVRUN3d0NSell4RXpBUkJnTlZCQW9NQ2tGd2NHeGxJRWx1WXk0eEN6QUpCZ05WQkFZVEFsVlRNQjRYRFRJMU1Ea3hPVEU1TkRRMU1Wb1hEVEkzTVRBeE16RTNORGN5TTFvd2daSXhRREErQmdOVkJBTU1OMUJ5YjJRZ1JVTkRJRTFoWXlCQmNIQWdVM1J2Y21VZ1lXNWtJR2xVZFc1bGN5QlRkRzl5WlNCU1pXTmxhWEIwSUZOcFoyNXBibWN4TERBcUJnTlZCQXNNSTBGd2NHeGxJRmR2Y214a2QybGtaU0JFWlhabGJHOXdaWElnVW1Wc1lYUnBiMjV6TVJNd0VRWURWUVFLREFwQmNIQnNaU0JKYm1NdU1Rc3dDUVlEVlFRR0V3SlZVekJaTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEEwSUFCTm5WdmhjdjdpVCs3RXg1dEJNQmdyUXNwSHpJc1hSaTBZeGZlazdsdjh3RW1qL2JIaVd0TndKcWMyQm9IenNRaUVqUDdLRklJS2c0WTh5MC9ueW51QW1qZ2dJSU1JSUNCREFNQmdOVkhSTUJBZjhFQWpBQU1COEdBMVVkSXdRWU1CYUFGRDh2bENOUjAxREptaWc5N2JCODVjK2xrR0taTUhBR0NDc0dBUVVGQndFQkJHUXdZakF0QmdnckJnRUZCUWN3QW9ZaGFIUjBjRG92TDJObGNuUnpMbUZ3Y0d4bExtTnZiUzkzZDJSeVp6WXVaR1Z5TURFR0NDc0dBUVVGQnpBQmhpVm9kSFJ3T2k4dmIyTnpjQzVoY0hCc1pTNWpiMjB2YjJOemNEQXpMWGQzWkhKbk5qQXlNSUlCSGdZRFZSMGdCSUlCRlRDQ0FSRXdnZ0VOQmdvcWhraUc5Mk5rQlFZQk1JSCtNSUhEQmdnckJnRUZCUWNDQWpDQnRneUJzMUpsYkdsaGJtTmxJRzl1SUhSb2FYTWdZMlZ5ZEdsbWFXTmhkR1VnWW5rZ1lXNTVJSEJoY25SNUlHRnpjM1Z0WlhNZ1lXTmpaWEIwWVc1alpTQnZaaUIwYUdVZ2RHaGxiaUJoY0hCc2FXTmhZbXhsSUhOMFlXNWtZWEprSUhSbGNtMXpJR0Z1WkNCamIyNWthWFJwYjI1eklHOW1JSFZ6WlN3Z1kyVnlkR2xtYVdOaGRHVWdjRzlzYVdONUlHRnVaQ0JqWlhKMGFXWnBZMkYwYVc5dUlIQnlZV04wYVdObElITjBZWFJsYldWdWRITXVNRFlHQ0NzR0FRVUZCd0lCRmlwb2RIUndPaTh2ZDNkM0xtRndjR3hsTG1OdmJTOWpaWEowYVdacFkyRjBaV0YxZEdodmNtbDBlUzh3SFFZRFZSME9CQllFRklGaW9HNHdNTVZBMWt1OXpKbUdOUEFWbjNlcU1BNEdBMVVkRHdFQi93UUVBd0lIZ0RBUUJnb3Foa2lHOTJOa0Jnc0JCQUlGQURBS0JnZ3Foa2pPUFFRREF3TnBBREJtQWpFQStxWG5SRUM3aFhJV1ZMc0x4em5qUnBJelBmN1ZIejlWL0NUbTgrTEpsclFlcG5tY1B2R0xOY1g2WFBubGNnTEFBakVBNUlqTlpLZ2c1cFE3OWtuRjRJYlRYZEt2OHZ1dElETVhEbWpQVlQzZEd2RnRzR1J3WE95d1Iya1pDZFNyZmVvdCIsIk1JSURGakNDQXB5Z0F3SUJBZ0lVSXNHaFJ3cDBjMm52VTRZU3ljYWZQVGp6Yk5jd0NnWUlLb1pJemowRUF3TXdaekViTUJrR0ExVUVBd3dTUVhCd2JHVWdVbTl2ZENCRFFTQXRJRWN6TVNZd0pBWURWUVFMREIxQmNIQnNaU0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURVRNQkVHQTFVRUNnd0tRWEJ3YkdVZ1NXNWpMakVMTUFrR0ExVUVCaE1DVlZNd0hoY05NakV3TXpFM01qQXpOekV3V2hjTk16WXdNekU1TURBd01EQXdXakIxTVVRd1FnWURWUVFERER0QmNIQnNaU0JYYjNKc1pIZHBaR1VnUkdWMlpXeHZjR1Z5SUZKbGJHRjBhVzl1Y3lCRFpYSjBhV1pwWTJGMGFXOXVJRUYxZEdodmNtbDBlVEVMTUFrR0ExVUVDd3dDUnpZeEV6QVJCZ05WQkFvTUNrRndjR3hsSUVsdVl5NHhDekFKQmdOVkJBWVRBbFZUTUhZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUNJRFlnQUVic1FLQzk0UHJsV21aWG5YZ3R4emRWSkw4VDBTR1luZ0RSR3BuZ24zTjZQVDhKTUViN0ZEaTRiQm1QaENuWjMvc3E2UEYvY0djS1hXc0w1dk90ZVJoeUo0NXgzQVNQN2NPQithYW85MGZjcHhTdi9FWkZibmlBYk5nWkdoSWhwSW80SDZNSUgzTUJJR0ExVWRFd0VCL3dRSU1BWUJBZjhDQVFBd0h3WURWUjBqQkJnd0ZvQVV1N0Rlb1ZnemlKcWtpcG5ldnIzcnI5ckxKS3N3UmdZSUt3WUJCUVVIQVFFRU9qQTRNRFlHQ0NzR0FRVUZCekFCaGlwb2RIUndPaTh2YjJOemNDNWhjSEJzWlM1amIyMHZiMk56Y0RBekxXRndjR3hsY205dmRHTmhaek13TndZRFZSMGZCREF3TGpBc29DcWdLSVltYUhSMGNEb3ZMMk55YkM1aGNIQnNaUzVqYjIwdllYQndiR1Z5YjI5MFkyRm5NeTVqY213d0hRWURWUjBPQkJZRUZEOHZsQ05SMDFESm1pZzk3YkI4NWMrbGtHS1pNQTRHQTFVZER3RUIvd1FFQXdJQkJqQVFCZ29xaGtpRzkyTmtCZ0lCQkFJRkFEQUtCZ2dxaGtqT1BRUURBd05vQURCbEFqQkFYaFNxNUl5S29nTUNQdHc0OTBCYUI2NzdDYUVHSlh1ZlFCL0VxWkdkNkNTamlDdE9udU1UYlhWWG14eGN4ZmtDTVFEVFNQeGFyWlh2TnJreFUzVGtVTUkzM3l6dkZWVlJUNHd4V0pDOTk0T3NkY1o0K1JHTnNZRHlSNWdtZHIwbkRHZz0iLCJNSUlDUXpDQ0FjbWdBd0lCQWdJSUxjWDhpTkxGUzVVd0NnWUlLb1pJemowRUF3TXdaekViTUJrR0ExVUVBd3dTUVhCd2JHVWdVbTl2ZENCRFFTQXRJRWN6TVNZd0pBWURWUVFMREIxQmNIQnNaU0JEWlhKMGFXWnBZMkYwYVc5dUlFRjFkR2h2Y21sMGVURVRNQkVHQTFVRUNnd0tRWEJ3YkdVZ1NXNWpMakVMTUFrR0ExVUVCaE1DVlZNd0hoY05NVFF3TkRNd01UZ3hPVEEyV2hjTk16a3dORE13TVRneE9UQTJXakJuTVJzd0dRWURWUVFEREJKQmNIQnNaU0JTYjI5MElFTkJJQzBnUnpNeEpqQWtCZ05WQkFzTUhVRndjR3hsSUVObGNuUnBabWxqWVhScGIyNGdRWFYwYUc5eWFYUjVNUk13RVFZRFZRUUtEQXBCY0hCc1pTQkpibU11TVFzd0NRWURWUVFHRXdKVlV6QjJNQkFHQnlxR1NNNDlBZ0VHQlN1QkJBQWlBMklBQkpqcEx6MUFjcVR0a3lKeWdSTWMzUkNWOGNXalRuSGNGQmJaRHVXbUJTcDNaSHRmVGpqVHV4eEV0WC8xSDdZeVlsM0o2WVJiVHpCUEVWb0EvVmhZREtYMUR5eE5CMGNUZGRxWGw1ZHZNVnp0SzUxN0lEdll1VlRaWHBta09sRUtNYU5DTUVBd0hRWURWUjBPQkJZRUZMdXczcUZZTTRpYXBJcVozcjY5NjYvYXl5U3JNQThHQTFVZEV3RUIvd1FGTUFNQkFmOHdEZ1lEVlIwUEFRSC9CQVFEQWdFR01Bb0dDQ3FHU000OUJBTURBMmdBTUdVQ01RQ0Q2Y0hFRmw0YVhUUVkyZTN2OUd3T0FFWkx1Tit5UmhIRkQvM21lb3locG12T3dnUFVuUFdUeG5TNGF0K3FJeFVDTUcxbWloREsxQTNVVDgyTlF6NjBpbU9sTTI3amJkb1h0MlFmeUZNbStZaGlkRGtMRjF2TFVhZ002QmdENTZLeUtBPT0iXX0.eyJyZWNlaXB0VHlwZSI6IlByb2R1Y3Rpb24iLCJhcHBBcHBsZUlkIjoxNjAwNTI1MDYxLCJidW5kbGVJZCI6ImNvbS5sb2NrZXQuTG9ja2V0IiwiYXBwbGljYXRpb25WZXJzaW9uIjoiMTA0NiIsInZlcnNpb25FeHRlcm5hbElkZW50aWZpZXIiOjg4OTQ2NzM1NywicmVjZWlwdENyZWF0aW9uRGF0ZSI6MTc4NjY4MzAyMjUxMSwicmVxdWVzdERhdGUiOjE3ODY2ODMwMjI1MTEsIm9yaWdpbmFsUHVyY2hhc2VEYXRlIjoxNzA4NjI1NjY5NTY0LCJvcmlnaW5hbEFwcGxpY2F0aW9uVmVyc2lvbiI6IjEiLCJkZXZpY2VWZXJpZmljYXRpb24iOiJXUUV1eEx3QWo4d1pVdkJkVFM3dnI4ZFFVOGFUZ205ZFI4Zzl6eUxSNTUrbUlkWWdhaHQvbmttb0VXdnBGb1RRIiwiZGV2aWNlVmVyaWZpY2F0aW9uTm9uY2UiOiI3OTQ3ZWRhMS1jMWVmLTQ4ZmItOWEyYS02MWI4YzBjM2YxOTciLCJvcmlnaW5hbFBsYXRmb3JtIjoiaU9TIiwiYXBwVHJhbnNhY3Rpb25JZCI6IjcwNDI3MjE5OTMxNTM1ODU2OSJ9.dD-eTadlrPvk-5Xj6iFlq2AD6prK9tmzG_zCkW_CIAKp46MJuvZDrblyIQXV3ahhMvGE7F_dZl7HPRBgkFcUkQ",
  hash_params:
    "app_user_id,fetch_token,app_transaction:sha256:8b6cce125219e2c6a26689448234c8c03894cb72855b73e8598c58ed1056d8df",
  hash_headers:
    "X-Is-Sandbox:sha256:fcbcf165908dd18a9e49f7ff27810176db8e9f63b4352213741664245224f8aa",
  is_sandbox: false,
};

const BASE_HEADERS: Record<string, string> = {
  Host: "api.revenuecat.com",
  Authorization: "Bearer appl_JngFETzdodyLmCREOlwTUtXdQik",
  "Content-Type": "application/json",
  Accept: "*/*",
  "X-Platform": "iOS",
  "X-Platform-Version": "Version 26.2 (Build 23C55)",
  "X-Platform-Device": "iPhone15,3",
  "X-Platform-Flavor": "native",
  "X-Version": "5.41.0",
  "X-Client-Version": "2.32.2",
  "X-Client-Bundle-ID": "com.locket.Locket",
  "X-Client-Build-Version": "3",
  "X-StoreKit2-Enabled": "true",
  "X-StoreKit-Version": "2",
  "X-Observer-Mode-Enabled": "false",
  "X-Is-Sandbox": "false",
  "X-Storefront": "VNM",
  "X-Apple-Device-Identifier": "39A73C25-1E05-4350-ADA7-5CD3FE1079E8",
  "X-Preferred-Locales": "vi_KR,ko_KR,en_KR",
  "X-Nonce": "w0Mlb6+AmV4WYuVv",
  "X-Is-Backgrounded": "false",
  "X-Retry-Count": "0",
  "X-Is-Debug-Build": "false",
  "User-Agent": "Locket/3 CFNetwork/3860.300.31 Darwin/25.2.0",
  "Accept-Language": "vi-VN,vi;q=0.9",
  "X-Post-Params-Hash": TOKEN_CONFIG.hash_params,
  "X-Headers-Hash": TOKEN_CONFIG.hash_headers,
};

/**
 * Phân giải username, link profile hoặc link invite thành UID 28 ký tự.
 */
async function resolveUid(input: string): Promise<string | null> {
  const raw = (input || "").trim();
  if (!raw) return null;

  // 1. Nhập trực tiếp UID 28 ký tự
  if (/^[A-Za-z0-9]{28}$/.test(raw)) {
    return raw;
  }

  // 2. Nhập URL invite (/invites/<UID>)
  const inviteMatch = raw.match(/\/invites\/([A-Za-z0-9]{28})/);
  if (inviteMatch?.[1]) {
    return inviteMatch[1];
  }

  // 3. Nhập URL profile locket.cam/<username> hoặc username thuần
  const profileMatch = raw.match(/locket\.cam\/([A-Za-z0-9_.-]+)/);
  const cleanUser = profileMatch ? profileMatch[1] : raw.replace(/^[@/]+/, "").split(/[?#]/)[0];

  if (!cleanUser) return null;

  const url = `https://locket.cam/${cleanUser}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        Accept: "text/html",
      },
      redirect: "follow",
    });

    const finalUrl = res.url || "";
    const html = await res.text();

    const extractFromText = (text: string): string | null => {
      if (!text) return null;
      const m1 = text.match(/\/invites\/([A-Za-z0-9]{28})/);
      if (m1?.[1]) return m1[1];

      const lp = text.match(/link=([^\s"'>]+)/);
      if (lp?.[1]) {
        try {
          const decoded = decodeURIComponent(lp[1]);
          const m2 = decoded.match(/\/invites\/([A-Za-z0-9]{28})/);
          if (m2?.[1]) return m2[1];
        } catch {}
      }
      return null;
    };

    return extractFromText(finalUrl) || extractFromText(html);
  } catch {
    return null;
  }
}

/**
 * Kiểm tra trạng thái Gold của UID từ RevenueCat
 */
async function checkStatus(uid: string): Promise<{ active: boolean; expires?: string }> {
  try {
    const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
      headers: BASE_HEADERS,
    });
    if (res.ok) {
      const data = await res.json();
      const entitlements = data?.subscriber?.entitlements?.Gold;
      if (entitlements) {
        return { active: true, expires: entitlements.expires_date };
      }
    }
  } catch {}
  return { active: false };
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    // Rate limit: tối đa 6 lượt / 10 phút / IP để chống DDoS / bot spam
    if (await rateLimit("locket-activate", ip, 6, 10 * 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau 10 phút!",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const target = (body.target || "").trim();

    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập Username Locket, Link mời hoặc UID 28 ký tự!",
        },
        { status: 400 }
      );
    }

    // Bước 1: Phân giải UID
    const uid = await resolveUid(target);
    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy UID tài khoản Locket từ thông tin bạn cung cấp. Vui lòng kiểm tra lại link mời (có dạng locket.cam/... hoặc /invites/...) hoặc username chính xác!",
        },
        { status: 400 }
      );
    }

    // Bước 2: Gửi biên lai Apple StoreKit 2
    const payload = {
      product_id: "locket_1600_1y",
      fetch_token: TOKEN_CONFIG.fetch_token,
      app_transaction: TOKEN_CONFIG.app_transaction,
      app_user_id: uid,
      is_restore: true,
      store_country: "VNM",
      currency: "VND",
      price: "399000",
      normal_duration: "P1Y",
      subscription_group_id: "21419447",
      observer_mode: false,
      initiation_source: "restore",
      offers: [],
      attributes: {
        $attConsentStatus: {
          updated_at_ms: Date.now(),
          value: "notDetermined",
        },
      },
    };

    let expiresDate: string | null = null;
    let activated = false;
    let errorMessage = "Kích hoạt chưa thành công. Vui lòng thử lại!";

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch("https://api.revenuecat.com/v1/receipts", {
          method: "POST",
          headers: BASE_HEADERS,
          body: JSON.stringify(payload),
        });

        if (res.status === 200) {
          const respData = await res.json().catch(() => ({}));
          const subscriber = respData?.subscriber || {};
          const entitlements = subscriber.entitlements || {};
          const subscriptions = subscriber.subscriptions || {};

          for (const key of Object.keys(entitlements)) {
            if (entitlements[key]?.expires_date) {
              expiresDate = entitlements[key].expires_date;
              break;
            }
          }

          if (!expiresDate) {
            for (const key of Object.keys(subscriptions)) {
              if (subscriptions[key]?.expires_date) {
                expiresDate = subscriptions[key].expires_date;
                break;
              }
            }
          }

          if (!expiresDate) {
            // Kiểm tra subscriber status fallback
            const status = await checkStatus(uid);
            if (status.active && status.expires) {
              expiresDate = status.expires;
            }
          }

          activated = true;
          break;
        } else if (res.status === 529) {
          // Server RevenueCat quá tải, chờ 1.5s và thử lại
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        } else {
          const errData = await res.json().catch(() => ({}));
          errorMessage = errData?.message || `Máy chủ xử lý phản hồi mã (${res.status}). Vui lòng thử lại sau!`;
          break;
        }
      } catch (err: any) {
        if (attempt === 2) {
          errorMessage = err?.message || "Lỗi kết nối tới máy chủ dịch vụ. Vui lòng thử lại sau!";
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const sessionUser = await getCurrentUser().catch(() => null);
    const userAgent = req.headers.get("user-agent")?.slice(0, 150) || "Mobile / iOS";

    if (activated) {
      await db.serviceUsageLog.create({
        data: {
          serviceType: "LOCKET_GOLD",
          serviceName: "Locket Gold",
          targetUser: target,
          ip,
          device: userAgent,
          status: "SUCCESS",
          metadata: JSON.stringify({ uid, expiresDate: expiresDate || "1 Năm (Tự động đồng bộ)" }),
          userId: sessionUser?.id ?? null,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        uid,
        expiresDate: expiresDate || "1 Năm (Tự động đồng bộ)",
        message: "Kích hoạt Locket Gold thành công!",
      });
    }

    await db.serviceUsageLog.create({
      data: {
        serviceType: "LOCKET_GOLD",
        serviceName: "Locket Gold",
        targetUser: target,
        ip,
        device: userAgent,
        status: "FAILED",
        metadata: JSON.stringify({ error: errorMessage }),
        userId: sessionUser?.id ?? null,
      },
    }).catch(() => {});

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Đã xảy ra lỗi không xác định trong quá trình xử lý.",
      },
      { status: 500 }
    );
  }
}
