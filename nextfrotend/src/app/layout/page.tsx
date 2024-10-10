"use client";

import { useContext, useState, useEffect } from "react";
import { staticConfigurationApi, TthemesItem } from "@/request";
import { THEME_CSS } from "@/constants";
import { UserInfo} from '@/components'
import Home from "../home/page";
import { isPlainObject } from "redux";

export default function Layout() {




  // 生命周期加载

  return (
    <div>
      <div className="flex justify-end p-4 pt-1 items-center gap-4">
        <UserInfo />
      </div>
      <Home />
    </div>
  );
}