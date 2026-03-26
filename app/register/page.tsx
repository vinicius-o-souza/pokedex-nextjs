import { redirect } from "next/navigation";

export default function RegisterPage() {
  redirect(`${process.env.DRUPAL_BASE_URL}/user/register`);
}
