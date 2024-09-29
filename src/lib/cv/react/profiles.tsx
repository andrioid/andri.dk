import { Link, Text, View } from "@react-pdf/renderer";
import { URL } from "url";
import { Icon } from "./icon";
import { Section } from "./section";
import { Profile } from "../types";

export function Profiles({ profiles }: { profiles: Profile[] }) {
  return (
    <Section title="Profiles">
      {profiles?.map((profile, idx) => {
        const key = `${profile.network}/${profile.username}`;
        return (
          <View
            key={key}
            style={{
              marginBottom: idx < profiles!.length ? 5 : 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Icon name={profile.network.toLowerCase() as any} />
              <View
                style={{
                  marginLeft: 10,
                  width: 30,
                }}
              >
                <Text>{profile.network}</Text>
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontStyle: "italic",
                }}
              >
                {profile.username}
              </Text>
            </View>
            <Text
              style={{
                color: "grey",
              }}
            >
              <Link src={profile.url}>{`${
                new URL(profile.url).hostname
              }${new URL(profile.url).pathname}`}</Link>
            </Text>
          </View>
        );
      })}
    </Section>
  );
}
