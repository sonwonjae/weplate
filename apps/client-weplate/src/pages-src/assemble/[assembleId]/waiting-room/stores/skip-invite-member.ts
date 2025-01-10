import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SkipInviteMemberState {
  isSkipInviteMember: boolean;
  toggleIsSkipInviteMember: () => void;
  resetSkipInviteMember: () => void;
}

const SKIP_INVITE_MEMBER_INITIAL_STATE: Partial<SkipInviteMemberState> = {
  isSkipInviteMember: false,
};

export const useSkipInviteMemberStore = create<SkipInviteMemberState>()(
  devtools((set, get) => {
    return {
      ...SKIP_INVITE_MEMBER_INITIAL_STATE,
      toggleIsSkipInviteMember: () => {
        return set(() => {
          return {
            isSkipInviteMember: !get().isSkipInviteMember,
          };
        });
      },
      resetSkipInviteMember: () => {
        return set(SKIP_INVITE_MEMBER_INITIAL_STATE);
      },
    };
  }),
);
