import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import { URL } from "url";
import { colors } from "../colors";
import { Profile } from "../types";
import { Icon } from "./icon";
import { Section } from "./section";

const cvNetworks = ["github", "linkedin"];

export function Profiles({ profiles = [] }: { profiles: Profile[] }) {
  const filteredProfiles = profiles.filter((p) => {
    if (cvNetworks.includes(p.network.toLowerCase())) return true;
    return false;
  });

  return (
    <Section title="Find me">
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.splitRow}>
            <Icon name={"home"} />
            <View>
              <Text>Personal page</Text>
            </View>
          </View>
          <Link style={styles.link} src="https://andri.dk">
            andri.dk
          </Link>
        </View>
        {filteredProfiles.map((profile, idx) => {
          const key = `${profile.network}/${profile.username}`;
          return (
            <View style={styles.item}>
              <View style={styles.splitRow}>
                <Icon name={profile.network.toLowerCase() as any} />
                <View>
                  <Text>{profile.network}</Text>
                </View>
                <Text style={{ fontStyle: "italic" }}>{profile.username}</Text>
              </View>
              <Text
                style={{
                  color: "grey",
                }}
              >
                <Link style={styles.link} src={profile.url}>{`${
                  new URL(profile.url).hostname
                }${new URL(profile.url).pathname}`}</Link>
              </Text>
            </View>
          );
        })}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecoration: "none",
    color: colors.programming,
  },
  splitRow: {
    flexDirection: "row",
    gap: 5,
  },
  item: {
    gap: 2,
  },
  container: {
    gap: 10,
  },
});
